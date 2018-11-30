from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseForbidden
from django.core.exceptions import PermissionDenied
from django.core.mail import EmailMessage
from django.conf import settings
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie
from time import time
from urllib import parse as urlparse
import simplejson as json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Count
from .models import Project, ProjectFile, FileCategory, ProjectLink, ProjectPosition, UserAlert, VolunteerRelation
from .helpers.projects import projects_tag_counts
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.helpers.tags import get_tags_by_category,get_tag_dictionary
from .forms import ProjectCreationForm
from democracylab.models import Contributor, get_request_contributor
from common.models.tags import Tag
from distutils.util import strtobool
from django.views.decorators.cache import cache_page

#TODO: Set getCounts to default to false if it's not passed? Or some hardening against malformed API requests

@cache_page(1200) #cache duration in seconds, cache_page docs: https://docs.djangoproject.com/en/2.1/topics/cache/#the-per-view-cache
def tags(request):
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(
        url_parts, keep_blank_values=0, strict_parsing=0)
    if 'category' in query_terms:
        category = query_terms.get('category')[0]
        queryset = get_tags_by_category(category)
        countoption = bool(strtobool(query_terms.get('getCounts')[0]))
        if countoption == True:
            activetagdict = projects_tag_counts()
            querydict = {tag.tag_name:tag for tag in queryset}
            resultdict = {}

            for slug in querydict.keys():
                resultdict[slug] = Tag.hydrate_tag_model(querydict[slug])
                resultdict[slug]['num_times'] = activetagdict[slug] if slug in activetagdict else 0
            tags = list(resultdict.values())
        else:
            tags = list(queryset.values())
    else:
        queryset = Tag.objects.all()
        tags = list(queryset.values())
    return HttpResponse(
        json.dumps(
            tags
        )
    )

def to_rows(items, width):
    rows = [[]]
    row_number = 0
    column_number = 0
    for item in items:
        rows[row_number].append(item)
        column_number += 1
        if column_number >= width:
            column_number = 0
            rows.append([])
            row_number += 1
    return rows

def to_tag_map(tags):
    tag_map = ((tag.tag_name, tag.display_name) for tag in tags)
    return list(tag_map)


def project_create(request):
    if not request.user.is_authenticated():
        return redirect('/signup')

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    ProjectCreationForm.create_project(request)
    return redirect('/index/?section=MyProjects')


def project_edit(request, project_id):
    if not request.user.is_authenticated():
        return redirect('/signup')

    try:
        ProjectCreationForm.edit_project(request, project_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return redirect('/index/?section=AboutProject&id=' + project_id)

# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def project_delete(request, project_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated():
        return HttpResponse(status=401)
    try:
        ProjectCreationForm.delete_project(request, project_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_project(request, project_id):
    project = Project.objects.get(id=project_id)
    return HttpResponse(json.dumps(project.hydrate_to_json()))


@ensure_csrf_cookie
def index(request):
    template = loader.get_template('new_index.html')
    context = {
        'FOOTER_LINKS': settings.FOOTER_LINKS,
        'PROJECT_DESCRIPTION_EXAMPLE_URL': settings.PROJECT_DESCRIPTION_EXAMPLE_URL
    }
    if settings.HOTJAR_APPLICATION_ID:
        context['hotjarScript'] = loader.render_to_string('scripts/hotjar_snippet.txt',
                                                          {'HOTJAR_APPLICATION_ID': settings.HOTJAR_APPLICATION_ID})
    if request.user.is_authenticated():
        contributor = Contributor.objects.get(id=request.user.id)
        context['userID'] = request.user.id
        context['emailVerified'] = contributor.email_verified
        context['firstName'] = contributor.first_name
        context['lastName'] = contributor.last_name
        context['isStaff'] = contributor.is_staff

    return HttpResponse(template.render(context, request))


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def add_alert(request):
    body = json.loads(request.body)
    UserAlert.create_or_update(
        email=body['email'], filters=body['filters'], country=body['country'], postal_code=body['postal_code'])
    return HttpResponse(status=200)


def my_projects(request):
    owned_projects = Project.objects.filter(project_creator_id=request.user.id)
    contributor = get_request_contributor(request)
    volunteering_projects = list(map(lambda volunteer_relation: volunteer_relation.project.hydrate_to_tile_json(), contributor.volunteer_relations.all()))
    response = {
        'owned_projects': [project.hydrate_to_tile_json() for project in owned_projects],
        'volunteering_projects': volunteering_projects
    }
    return HttpResponse(json.dumps(response))


def projects_list(request):
    project_list = Project.objects.filter(is_searchable=True)
    if request.method == 'GET':
        url_parts = request.GET.urlencode()
        query_params = urlparse.parse_qs(
            url_parts, keep_blank_values=0, strict_parsing=0)
        project_list = apply_tag_filters(project_list, query_params, 'issues', projects_by_issue_areas)
        project_list = apply_tag_filters(project_list, query_params, 'tech', projects_by_technologies)
        project_list = apply_tag_filters(project_list, query_params, 'role', projects_by_roles)
        project_list = apply_tag_filters(project_list, query_params, 'org', projects_by_orgs)
        project_list = apply_tag_filters(project_list, query_params, 'stage', projects_by_stage)
        if 'keyword' in query_params:
            project_list = project_list & projects_by_keyword(query_params['keyword'][0])

        if 'location' in query_params:
            project_list = projects_by_location(project_list, query_params['location'][0])

        project_list = project_list.distinct()

        if 'sortField' in query_params:
            project_list = projects_by_sortField(project_list, query_params['sortField'][0])
        else:
            project_list = projects_by_sortField(project_list, '-project_date_modified')

    response = json.dumps(projects_with_filter_counts(project_list))
    return HttpResponse(response)


def apply_tag_filters(project_list, query_params, param_name, tag_filter):
    if param_name in query_params:
        tag_dict = get_tag_dictionary()
        tags_to_filter_by = query_params[param_name][0].split(',')
        tags_to_filter_by = clean_nonexistent_tags(tags_to_filter_by, tag_dict)
        if len(tags_to_filter_by):
            project_list = project_list & tag_filter(tags_to_filter_by)

    return project_list


def clean_nonexistent_tags(tags, tag_dict):
    return list(filter(lambda tag: tag in tag_dict, tags))


def projects_by_keyword(keyword):
    return Project.objects.filter(Q(project_description__icontains=keyword) | Q(project_name__icontains=keyword))


def projects_by_sortField(project_list, sortField):
    return project_list.order_by(sortField)


def projects_by_location(project_list, location):
    return project_list.filter(Q(project_location__icontains=location))


def projects_by_issue_areas(tags):
    return Project.objects.filter(project_issue_area__name__in=tags)


def projects_by_technologies(tags):
    return Project.objects.filter(project_technologies__name__in=tags)

def projects_by_orgs(tags):
    return Project.objects.filter(project_organization__name__in=tags)

def projects_by_stage(tags):
    return Project.objects.filter(project_stage__name__in=tags)

def projects_by_roles(tags):
    # Get roles by tags
    positions = ProjectPosition.objects.filter(position_role__name__in=tags).select_related('position_project')

    # Get the list of projects linked to those roles
    return Project.objects.filter(positions__in=positions)


def projects_with_filter_counts(projects):
    return {
        'projects': [project.hydrate_to_tile_json() for project in projects],
        'tags': list(Tag.objects.values())
    }


def available_tag_filters(projects, selected_tag_filters):
    project_tags = projects_tag_counts(projects)
    # Remove any filters that are already selected
    for tag in selected_tag_filters:
        if project_tags[tag]:
            project_tags.pop(tag)
    return project_tags


def presign_project_thumbnail_upload(request):
    uploader = request.user.username
    file_name = request.GET['file_name']
    file_type = request.GET['file_type']
    file_extension = file_type.split('/')[-1]
    unique_file_name = file_name + '_' + str(time())
    s3_key = 'thumbnails/%s/%s.%s' % (
        uploader, unique_file_name, file_extension)
    return presign_s3_upload(
        raw_key=s3_key, file_name=file_name, file_type=file_type, acl="public-read")


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def delete_uploaded_file(request, s3_key):
    uploader = request.user.username
    has_permisson = user_has_permission_for_s3_file(uploader, s3_key)

    if has_permisson:
        delete_s3_file(s3_key)
        return HttpResponse(status=202)
    else:
        # TODO: Log this
        return HttpResponse(status=401)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_owner(request, project_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    body = json.loads(request.body)
    message = body['message']

    project = Project.objects.get(id=project_id)
    email_msg = EmailMessage(
        '{firstname} {lastname} would like to connect with {project}'.format(
            firstname=user.first_name,
            lastname=user.last_name,
            project=project.project_name),
        '{message} \n -- \n To contact this person, email {user}'.format(message=message, user=user.email),
        settings.EMAIL_HOST_USER,
        [project.project_creator.email],
        {'Reply-To': user.email}
    )
    email_msg.send()
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def volunteer_with_project(request, project_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    project = Project.objects.get(id=project_id)
    body = json.loads(request.body)
    projected_end_date = body['projectedEndDate']
    message = body['message']
    role = body['roleTag']
    VolunteerRelation.create(project=project, volunteer=user, projected_end_date=projected_end_date, role=role, application_text=message)

    # TODO: Include what role they are volunteering for
    user_profile_url = settings.PROTOCOL_DOMAIN + '/index/?section=Profile&id=' + str(user.id)
    email_body = '{message} \n -- \n To view volunteer profile, see {url} \n'.format(message=message, user=user.email, url=user_profile_url)
    email_msg = EmailMessage(
        '{firstname} {lastname} would like to volunteer with {project}'.format(
            firstname=user.first_name,
            lastname=user.last_name,
            project=project.project_name),
        email_body,
        settings.EMAIL_HOST_USER,
        [project.project_creator.email],
        {'Reply-To': user.email}
    )
    email_msg.send()
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def accept_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if request.user.username == volunteer_relation.project.project_creator.username:
        # Set approved flag
        volunteer_relation.is_approved = True
        volunteer_relation.save()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def reject_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if request.user.username == volunteer_relation.project.project_creator.username:
        body = json.loads(request.body)
        message = body['rejection_message']
        email_body_template = 'The project owner for {project_name} has declined your application for the following reason:\n{message}'
        email_body = email_body_template.format(project_name=volunteer_relation.project.project_name,message=message)
        email_msg = EmailMessage(
            'Your application to join ' + volunteer_relation.project.project_name,
            email_body,
            settings.EMAIL_HOST_USER,
            [volunteer_relation.volunteer.email],
            {'Reply-To': volunteer_relation.project.project_creator.email}
        )
        email_msg.send()
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def dismiss_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if request.user.username == volunteer_relation.project.project_creator.username:
        body = json.loads(request.body)
        message = body['dismissal_message']
        email_body = 'The owner for {project_name} has removed you from the project for the following reason:\n{message}'.format(
            project_name=volunteer_relation.project.project_name, message=message)
        email_msg = EmailMessage(
            'You have been dismissed from ' + volunteer_relation.project.project_name,
            email_body,
            settings.EMAIL_HOST_USER,
            [volunteer_relation.volunteer.email],
            {'Reply-To': volunteer_relation.project.project_creator.email}
        )
        email_msg.send()
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def leave_project(request, project_id):
    volunteer_relation = VolunteerRelation.objects.filter(project_id=project_id, volunteer_id=request.user.id).first()
    if request.user.id == volunteer_relation.volunteer.id:
        body = json.loads(request.body)
        message = body['departure_message']
        email_body = '{volunteer_name} is leaving {project_name} for the following reason:\n{message}'.format(
            volunteer_name=volunteer_relation.volunteer.full_name(),
            project_name=volunteer_relation.project.project_name,
            message=message)
        email_subject = '{volunteer_name} is leaving {project_name}'.format(
            volunteer_name=volunteer_relation.volunteer.full_name(),
            project_name=volunteer_relation.project.project_name)
        email_msg = EmailMessage(
            email_subject,
            email_body,
            settings.EMAIL_HOST_USER,
            [volunteer_relation.project.project_creator.email],
            {'Reply-To': volunteer_relation.volunteer.email}
        )
        email_msg.send()
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()