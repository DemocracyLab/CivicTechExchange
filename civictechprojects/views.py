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
from .models import Project, ProjectFile, FileCategory, ProjectLink, ProjectPosition, UserAlert
from .helpers.projects import projects_tag_counts
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.helpers.tags import get_tags_by_category,get_tag_dictionary
from .forms import ProjectCreationForm
from democracylab.models import Contributor, get_request_contributor
from common.models.tags import Tag

#TODO: Add a flag so not all category queries ask for tag counts
def tags(request):
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(
        url_parts, keep_blank_values=0, strict_parsing=0)
    if 'category' in query_terms:
        category = query_terms.get('category')[0]
        queryset = get_tags_by_category(category)
        activetagdict = projects_tag_counts()
        querydict = {tag.tag_name:tag for tag in queryset}
        resultdict = {}

        for slug in querydict.keys():
            resultdict[slug] = Tag.hydrate_tag_model(querydict[slug])
            resultdict[slug]['num_times'] = activetagdict[slug] if slug in activetagdict else 0
        tags = list(resultdict.values())
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


# TODO: Remove when React implementation complete
def project(request, project_id):
    project = Project.objects.get(id=project_id)
    template = loader.get_template('project.html')
    files = ProjectFile.objects.filter(file_project=project_id)
    thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
    other_files = list(files.filter(file_category=FileCategory.ETC.value))
    links = ProjectLink.objects.filter(link_project=project_id)
    context = {
        'project': project,
        'files': map(lambda file: file.to_json(), other_files),
        'links': map(lambda link: link.to_json(), links),
    }
    if len(thumbnail_files) > 0:
        context['thumbnail'] = thumbnail_files[0].to_json()
    return HttpResponse(template.render(context, request))


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
    if request.user.is_authenticated():
        contributor = Contributor.objects.get(id=request.user.id)
        context['userID'] = request.user.id
        context['emailVerified'] = contributor.email_verified
        context['firstName'] = contributor.first_name
        context['lastName'] = contributor.last_name

    return HttpResponse(template.render(context, request))


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def add_alert(request):
    body = json.loads(request.body)
    UserAlert.create_or_update(
        email=body['email'], filters=body['filters'], country=body['country'], postal_code=body['postal_code'])
    return HttpResponse(status=200)


def my_projects(request):
    projects = Project.objects.filter(project_creator_id=request.user.id)
    return HttpResponse(json.dumps([
        project.hydrate_to_json() for project in projects
    ]))


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

    response = json.dumps(projects_with_filter_counts(project_list.distinct().order_by('project_name')))
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
        'projects': [project.hydrate_to_json() for project in projects],
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
