from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator
from django.conf import settings
from django.contrib import messages
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.template import loader
from django.utils import timezone
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from time import time
from urllib import parse as urlparse
import simplejson as json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .models import FileCategory, Project, ProjectFile, ProjectPosition, UserAlert, VolunteerRelation, Group, Event, ProjectRelationship
from .helpers.projects import projects_tag_counts
from .sitemaps import SitemapPages
from common.helpers.collections import flatten, count_occurrences
from common.helpers.db import unique_column_values
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.helpers.tags import get_tags_by_category,get_tag_dictionary
from common.helpers.form_helpers import is_co_owner_or_staff, is_co_owner, is_co_owner_or_owner, is_creator_or_staff, is_creator
from .forms import ProjectCreationForm, EventCreationForm, GroupCreationForm
from common.helpers.qiqo_chat import get_user_qiqo_iframe
from democracylab.models import Contributor, get_request_contributor
from common.models.tags import Tag
from common.helpers.constants import FrontEndSection, TagCategory
from democracylab.emails import send_to_project_owners, send_to_project_volunteer, HtmlEmailTemplate, send_volunteer_application_email, \
    send_volunteer_conclude_email, notify_project_owners_volunteer_renewed_email, notify_project_owners_volunteer_concluded_email, \
    notify_project_owners_project_approved, contact_democracylab_email, send_to_group_owners, send_group_project_invitation_email, \
    notify_group_owners_group_approved
from common.helpers.front_end import section_url, get_page_section
from common.helpers.caching import update_cached_project_url
from distutils.util import strtobool
from django.views.decorators.cache import cache_page
import requests



# TODO: Set getCounts to default to false if it's not passed? Or some hardening against malformed API requests
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
        countoption = bool(strtobool(query_terms.get('getCounts')[0]))
        if countoption == True:
            queryset = Tag.objects.all()
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
    return JsonResponse(tags, safe=False)


@cache_page(1200) #cache duration in seconds, cache_page docs: https://docs.djangoproject.com/en/2.1/topics/cache/#the-per-view-cache
def group_tags_counts(request):
    # Get all groups
    all_groups = Group.objects.all()
    # Get Groups issue areas
    group_issues = list(map(lambda group: group.get_project_issue_areas(with_counts=False), all_groups))
    # Count up instances of tags
    group_issues_counts = count_occurrences(flatten(group_issues))
    issue_tags = {}
    for issue_tag in group_issues_counts.keys():
        issue_tags[issue_tag] = Tag.hydrate_tag_model(Tag.get_by_name(issue_tag))
        issue_tags[issue_tag]['num_times'] = group_issues_counts[issue_tag]
    return JsonResponse(list(issue_tags.values()), safe=False)


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

# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def group_create(request):
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn))

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    group = GroupCreationForm.create_or_edit_group(request, None)
    return JsonResponse(group.hydrate_to_json())


def group_edit(request, group_id):
    if not request.user.is_authenticated():
        return redirect('/signup')

    group = None
    try:
        group = GroupCreationForm.create_or_edit_group(request, group_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    if request.is_ajax():
        return JsonResponse(group.hydrate_to_json())
    else:
        return redirect('/index/?section=AboutGroup&id=' + group_id)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def group_delete(request, group_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated():
        return HttpResponse(status=401)
    try:
        GroupCreationForm.delete_group(request, group_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_group(request, group_id):
    group = Group.objects.get(id=group_id)

    if group is not None:
        if group.is_searchable or is_creator_or_staff(get_request_contributor(request), group):
            return JsonResponse(group.hydrate_to_json())
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)

@csrf_exempt
def group_add_project(request, group_id):
    body = json.loads(request.body)
    group = Group.objects.get(id=group_id)

    if group is not None and body["project_ids"] is not None:
        if not is_creator_or_staff(get_request_contributor(request), group):
            return HttpResponseForbidden()

        projects = Project.objects.filter(id__in=body["project_ids"])

        for project in projects:
            ProjectRelationship.create(group, project)

        return HttpResponse(status=204)
    else:
        return HttpResponse(status=404)

def group_delete_project(request, group_id):
    body = json.loads(request.body)
    group = Group.objects.get(id=group_id)
    project = Project.objects.get(id=body["project_id"])

    if group is not None and project is not None:
        if is_creator_or_staff(get_request_contributor(request), group):
            relationship = ProjectRelationship.objects.get(relationship_project=project.id, relationship_group=group.id)

            if relationship is not None:
                relationship.delete()
                return HttpResponse(status=204)

    return HttpResponse(status=404)


def approve_group(request, group_id):
    group = Group.objects.get(id=group_id)
    user = get_request_contributor(request)

    if group is not None:
        if user.is_staff:
            group.is_searchable = True
            group.save()
            # SitemapPages.update()
            notify_group_owners_group_approved(group)
            messages.success(request, 'Group Approved')

            return redirect(section_url(FrontEndSection.AboutGroup, {'id': str(group.id)}))
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def event_create(request):
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn))

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    event = None
    try:
        event = EventCreationForm.create_or_edit_event(request, None)
    except PermissionDenied:
        return HttpResponseForbidden()
    return JsonResponse(event.hydrate_to_json())


def event_edit(request, event_id):
    if not request.user.is_authenticated():
        return redirect('/signup')

    event = None
    try:
        event = EventCreationForm.create_or_edit_event(request, event_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    if request.is_ajax():
        return JsonResponse(event.hydrate_to_json())
    else:
        return redirect('/index/?section=AboutEvent&id=' + event_id)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def event_delete(request, event_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated():
        return HttpResponse(status=401)
    try:
        EventCreationForm.delete_event(request, event_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_event(request, event_id):
    event = Event.objects.get(id=event_id)

    if event is not None:
        if event.is_searchable or is_creator_or_staff(get_request_contributor(request), event):
            return JsonResponse(event.hydrate_to_json())
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)

def event_add_project(request, event_id):
    body = json.loads(request.body)
    event = Event.objects.get(id=event_id)

    if event is not None and body["project_ids"] is not None:
        if not is_creator_or_staff(get_request_contributor(request), event):
            return HttpResponseForbidden()

        projects = Project.objects.filter(id__in=body["project_ids"])

        for project in projects:
            ProjectRelationship.create(event, project)

        return HttpResponse(status=204)
    else:
        return HttpResponse(status=404)

def event_delete_project(request, event_id):
    body = json.loads(request.body)
    event = Event.objects.get(id=event_id)
    project = Project.objects.get(id=body["project_id"])

    if event is not None and project is not None:
        if is_creator_or_staff(get_request_contributor(request), event):
            relationship = ProjectRelationship.objects.get(relationship_project=project.id, relationship_event=event.id)

            if relationship is not None:
                relationship.delete()
                return HttpResponse(status=204)

    return HttpResponse(status=404)

# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def project_create(request):
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn))

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    project = ProjectCreationForm.create_or_edit_project(request, None)
    return JsonResponse(project.hydrate_to_json())


def project_edit(request, project_id):
    if not request.user.is_authenticated():
        return redirect('/signup')

    try:
        project = ProjectCreationForm.create_or_edit_project(request, project_id)
        # TODO:
        # update_cached_project_url(project_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    if request.is_ajax():
        return JsonResponse(project.hydrate_to_json())
    else:
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

    if project is not None:
        if project.is_searchable or is_co_owner_or_staff(get_request_contributor(request), project):
            return JsonResponse(project.hydrate_to_json())
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


def approve_project(request, project_id):
    project = Project.objects.get(id=project_id)
    user = get_request_contributor(request)

    if project is not None:
        if user.is_staff:
            project.is_searchable = True
            project.save()
            SitemapPages.update()
            notify_project_owners_project_approved(project)
            messages.success(request, 'Project Approved')
            return redirect('/index/?section=AboutProject&id=' + str(project.id))
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


@ensure_csrf_cookie
@xframe_options_exempt
def index(request):
    template = loader.get_template('new_index.html')
    context = {
        'DLAB_PROJECT_ID': settings.DLAB_PROJECT_ID or '',
        'PROJECT_DESCRIPTION_EXAMPLE_URL': settings.PROJECT_DESCRIPTION_EXAMPLE_URL,
        'POSITION_DESCRIPTION_EXAMPLE_URL': settings.POSITION_DESCRIPTION_EXAMPLE_URL,
        'STATIC_CDN_URL': settings.STATIC_CDN_URL,
        'HEADER_ALERT': settings.HEADER_ALERT,
        'SPONSORS_METADATA': settings.SPONSORS_METADATA,
        'userImgUrl' : '',
        'PAYPAL_ENDPOINT': settings.PAYPAL_ENDPOINT,
        'PAYPAL_PAYEE': settings.PAYPAL_PAYEE,
        'PRESS_LINKS': settings.PRESS_LINKS,
        'organizationSnippet': loader.render_to_string('scripts/org_snippet.txt'),
        'GR_SITEKEY': settings.GR_SITEKEY,
        'FAVICON_PATH': settings.FAVICON_PATH,
        'BLOG_URL': settings.BLOG_URL,
        'EVENT_URL': settings.EVENT_URL,
        'PRIVACY_POLICY_URL': settings.PRIVACY_POLICY_URL
    }
    if settings.HOTJAR_APPLICATION_ID:
        context['hotjarScript'] = loader.render_to_string('scripts/hotjar_snippet.txt',
                                                          {'HOTJAR_APPLICATION_ID': settings.HOTJAR_APPLICATION_ID})

    GOOGLE_CONVERSION_ID = None
    page = get_page_section(request.get_full_path())
    if page and settings.GOOGLE_CONVERSION_IDS and page in settings.GOOGLE_CONVERSION_IDS:
        GOOGLE_CONVERSION_ID = settings.GOOGLE_CONVERSION_IDS[page]
    if settings.GOOGLE_PROPERTY_ID:
        context['googleScript'] = loader.render_to_string('scripts/google_snippet.txt',
                                                          {
                                                              'GOOGLE_PROPERTY_ID': settings.GOOGLE_PROPERTY_ID,
                                                              'GOOGLE_ADS_ID': settings.GOOGLE_ADS_ID,
                                                              'GOOGLE_CONVERSION_ID': GOOGLE_CONVERSION_ID
                                                          })

    if settings.GOOGLE_TAGS_ID:
        google_tag_context = {'GOOGLE_TAGS_ID': settings.GOOGLE_TAGS_ID}
        context['googleTagsHeadScript'] = loader.render_to_string('scripts/google_tag_manager_snippet_head.txt', google_tag_context)
        context['googleTagsBodyScript'] = loader.render_to_string('scripts/google_tag_manager_snippet_body.txt', google_tag_context)

    if hasattr(settings, 'SOCIAL_APPS_VISIBILITY'):
        context['SOCIAL_APPS_VISIBILITY'] = json.dumps(settings.SOCIAL_APPS_VISIBILITY)

    if hasattr(settings, 'HERE_CONFIG'):
        context['HERE_CONFIG'] = settings.HERE_CONFIG

    if request.user.is_authenticated():
        contributor = Contributor.objects.get(id=request.user.id)
        context['userID'] = request.user.id
        context['emailVerified'] = contributor.email_verified
        context['email'] = contributor.email
        context['firstName'] = contributor.first_name
        context['lastName'] = contributor.last_name
        context['isStaff'] = contributor.is_staff
        context['volunteeringUpForRenewal'] = contributor.is_up_for_volunteering_renewal()
        context['QIQO_IFRAME_URL'] = get_user_qiqo_iframe(contributor)

        thumbnail = ProjectFile.objects.filter(file_user=request.user.id,
                                               file_category=FileCategory.THUMBNAIL.value).first()
        if thumbnail:
            context['userImgUrl'] = thumbnail.file_url

    return HttpResponse(template.render(context, request))


def get_site_stats(request):
    active_volunteers = VolunteerRelation.objects.filter(deleted=False)

    stats = {
        'projectCount': Project.objects.filter(is_searchable=True, deleted=False).count(),
        'userCount': Contributor.objects.filter(is_active=True).count(),
        'activeVolunteerCount': active_volunteers.distinct('volunteer__id').count(),
        'dlVolunteerCount': active_volunteers.filter(is_approved=True, project__id=settings.DLAB_PROJECT_ID).count()
    }

    return JsonResponse(stats)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def add_alert(request):
    body = json.loads(request.body)
    UserAlert.create_or_update(
        email=body['email'], filters=body['filters'], country=body['country'], postal_code=body['postal_code'])
    return HttpResponse(status=200)


def my_projects(request):
    contributor = get_request_contributor(request)
    response = {}
    if contributor is not None:
        owned_projects = Project.objects.filter(project_creator_id=contributor.id)
        volunteering_projects = contributor.volunteer_relations.all()
        response = {
            'owned_projects': [project.hydrate_to_list_json() for project in owned_projects],
            'volunteering_projects': volunteering_projects.exists() and list(map(lambda volunteer_relation: volunteer_relation.hydrate_project_volunteer_info(), volunteering_projects))
        }
    return JsonResponse(response)


def my_groups(request):
    contributor = get_request_contributor(request)
    response = {}
    if contributor is not None:
        owned_groups = Group.objects.filter(group_creator_id=contributor.id)
        response = {
            'owned_groups': [group.hydrate_to_list_json() for group in owned_groups],
        }
    return JsonResponse(response)


def my_events(request):
    contributor = get_request_contributor(request)
    response = {}
    if contributor is not None:
        owned_events = Event.objects.filter(event_creator_id=contributor.id)
        response = {
            'owned_events': [event.hydrate_to_list_json() for event in owned_events],
        }
    return JsonResponse(response)


def projects_list(request):
    url_parts = request.GET.urlencode()
    query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    project_relationships = None

    if 'group_id' in query_params:
        project_relationships = ProjectRelationship.objects.filter(relationship_group=query_params['group_id'][0])
    elif 'event_id' in query_params:
        project_relationships = ProjectRelationship.objects.filter(relationship_event=query_params['event_id'][0])

    if project_relationships is not None:
        project_ids = list(map(lambda relationship: relationship.relationship_project.id, project_relationships))
        project_list = Project.objects.filter(id__in=project_ids, is_searchable=True)
    else:
        project_list = Project.objects.filter(is_searchable=True)

    if request.method == 'GET':
        project_list = apply_tag_filters(project_list, query_params, 'issues', projects_by_issue_areas)
        project_list = apply_tag_filters(project_list, query_params, 'tech', projects_by_technologies)
        project_list = apply_tag_filters(project_list, query_params, 'role', projects_by_roles)
        project_list = apply_tag_filters(project_list, query_params, 'org', projects_by_orgs)
        project_list = apply_tag_filters(project_list, query_params, 'orgType', projects_by_org_types)
        project_list = apply_tag_filters(project_list, query_params, 'stage', projects_by_stage)
        if 'keyword' in query_params:
            project_list = project_list & projects_by_keyword(query_params['keyword'][0])

        if 'locationRadius' in query_params:
            project_list = projects_by_location(project_list, query_params['locationRadius'][0])

        if 'location' in query_params:
            project_list = projects_by_legacy_city(project_list, query_params['location'][0])

        project_list = project_list.distinct()

        if 'sortField' in query_params:
            project_list = projects_by_sortField(project_list, query_params['sortField'][0])
        else:
            project_list = projects_by_sortField(project_list, '-project_date_modified')

        project_count = len(project_list)

        project_paginator = Paginator(project_list, settings.PROJECTS_PER_PAGE)

        if 'page' in query_params:
            project_list_page = project_paginator.page(query_params['page'][0])
            project_pages = project_paginator.num_pages
        else:
            project_list_page = project_list
            project_pages = 1


    response = projects_with_meta_data(project_list_page, project_pages, project_count)

    return JsonResponse(response)


def recent_projects_list(request):
    if request.method == 'GET':
        url_parts = request.GET.urlencode()
        query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
        project_count = int(query_params['count'][0]) if 'count' in query_params else 3
        project_list = Project.objects.filter(is_searchable=True)
        # Filter out the DemocracyLab project
        if settings.DLAB_PROJECT_ID.isdigit():
            project_list = project_list.exclude(id=int(settings.DLAB_PROJECT_ID))
        project_list = projects_by_sortField(project_list, '-project_date_modified')[:project_count]
        hydrated_project_list = list(project.hydrate_to_tile_json() for project in project_list)
        return JsonResponse({'projects': hydrated_project_list})


def limited_listings(request):
    """Summarizes current positions in a format specified by the LinkedIn "Limited Listings" feature."""

    def cdata(str):
        # Using CDATA tags (and escaping the close sequence) protects us from XSS attacks when
        # displaying user provided string values.
        return f"<![CDATA[{str.replace(']]>', ']]]]><![CDATA[>')}]]>"
    
    def position_to_job(position):
        project = position.position_project
        roleTag = Tag.get_by_name(position.position_role.first().slug)

        return f"""
        <job>
            <company>{cdata(project.project_name)}</company>
            <title>{cdata(roleTag.display_name)}</title>
            <description>{cdata(position.position_description)}</description>
            <partnerJobId>{cdata(str(position.id))}</partnerJobId>
            <location>{cdata(", ".join([project.project_city, project.project.state]))}</location>
            <city>{cdata(project.project_city)}</city>
            <state>{cdata(project.project_state)}</state>
            <country>{cdata(project.project_country)}</country>
            <applyUrl>{cdata(position.description_url or project.project_url)}</applyUrl>
            <industryCodes><industryCode>{cdata("4")}</industryCode></industryCodes>
        </job>
        """
    
    xml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
    <source>
        <lastBuildDate>{timezone.now().strftime('%a, %d %b %Y %H:%M:%S %Z')}</lastBuildDate> 
        <publisherUrl>https://www.democracylab.org</publisherUrl>
        <publisher>DemocracyLab</publisher>
        {"".join(map(position_to_job, ProjectPosition.objects.all()))}
    </source>"""

    return HttpResponse(xml_response, content_type="application/xml")


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
    return Project.objects.filter(Q(project_name__icontains=keyword)
                                  | Q(project_short_description__icontains=keyword)
                                  | Q(project_description__icontains=keyword)
                                  | Q(project_description_solution__icontains=keyword)
                                  | Q(project_description_actions__icontains=keyword))


# TODO: Rename to something generic
def projects_by_sortField(project_list, sortField):
    return project_list.order_by(sortField)


def projects_by_location(project_list, param):
    param_parts = param.split(',')
    location = Point(float(param_parts[1]), float(param_parts[0]))
    radius = float(param_parts[2])
    project_list = project_list.filter(project_location_coords__distance_lte=(location, D(mi=radius)))
    return project_list


def projects_by_legacy_city(project_list, param):
    param_parts = param.split(', ')
    if len(param_parts) > 1:
        project_list = project_list.filter(project_city=param_parts[0], project_state=param_parts[1])
    return project_list


def projects_by_issue_areas(tags):
    return Project.objects.filter(project_issue_area__name__in=tags)


def projects_by_technologies(tags):
    return Project.objects.filter(project_technologies__name__in=tags)


def projects_by_orgs(tags):
    return Project.objects.filter(project_organization__name__in=tags)


def projects_by_org_types(tags):
    return Project.objects.filter(project_organization_type__name__in=tags)


def projects_by_stage(tags):
    return Project.objects.filter(project_stage__name__in=tags)


def projects_by_roles(tags):
    # Get roles by tags
    positions = ProjectPosition.objects.filter(position_role__name__in=tags).select_related('position_project')

    # Get the list of projects linked to those roles
    return Project.objects.filter(positions__in=positions)


def project_countries():
    return unique_column_values(Project, 'project_country', lambda country: country and len(country) == 2)


def projects_with_meta_data(projects, project_pages, project_count):
    return {
        'projects': [project.hydrate_to_tile_json() for project in projects],
        'availableCountries': project_countries(),
        'tags': list(Tag.objects.values()),
        'numPages': project_pages,
        'numProjects': project_count
    }


def available_tag_filters(projects, selected_tag_filters):
    project_tags = projects_tag_counts(projects)
    # Remove any filters that are already selected
    for tag in selected_tag_filters:
        if project_tags[tag]:
            project_tags.pop(tag)
    return project_tags


# TODO: Move group search code into new file
def groups_list(request):
    url_parts = request.GET.urlencode()
    query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    group_list = Group.objects.filter(is_searchable=True)

    if request.method == 'GET':
        group_list = group_list & apply_tag_filters(group_list, query_params, 'issues', groups_by_issue_areas)
        if 'keyword' in query_params:
            group_list = group_list & groups_by_keyword(query_params['keyword'][0])

        if 'locationRadius' in query_params:
            group_list = groups_by_location(group_list, query_params['locationRadius'][0])

        group_list = group_list.distinct()

        if 'sortField' in query_params:
            group_list = projects_by_sortField(group_list, query_params['sortField'][0])
        else:
            group_list = projects_by_sortField(group_list, '-group_date_modified')

        group_count = len(group_list)

        group_paginator = Paginator(group_list, settings.PROJECTS_PER_PAGE)

        if 'page' in query_params:
            group_list_page = group_paginator.page(query_params['page'][0])
            group_pages = group_paginator.num_pages
        else:
            group_list_page = group_list
            group_pages = 1

        response = groups_with_meta_data(group_list_page, group_pages, group_count)

        return JsonResponse(response)


def groups_by_keyword(keyword):
    return Group.objects.filter(Q(group_name__icontains=keyword)
                                | Q(group_short_description__icontains=keyword)
                                | Q(group_description__icontains=keyword))


def groups_by_location(group_list, param):
    param_parts = param.split(',')
    location = Point(float(param_parts[1]), float(param_parts[0]))
    radius = float(param_parts[2])
    group_list = group_list.filter(group_location_coords__distance_lte=(location, D(mi=radius)))
    return group_list


def groups_by_issue_areas(issues):
    group_relationships = ProjectRelationship.objects.exclude(relationship_group=None)\
        .filter(relationship_project__project_issue_area__name__in=issues)
    relationship_ids = list(map(lambda pr: pr.relationship_group.id, group_relationships))

    return Group.objects.filter(id__in=relationship_ids)


def groups_with_meta_data(groups, group_pages, group_count):
    return {
        'groups': [group.hydrate_to_tile_json() for group in groups],
        'availableCountries': group_countries(),
        'tags': list(Tag.objects.filter(category=TagCategory.ISSUE_ADDRESSED.value).values()),
        'numPages': group_pages,
        'numGroups': group_count
    }


def group_countries():
    return unique_column_values(Group, 'group_country', lambda country: country and len(country) == 2)


def events_list(request):
    events = Event.objects.filter(is_created=True, is_searchable=True)
    return JsonResponse({'events': [event.hydrate_to_tile_json() for event in events]})


def presign_project_thumbnail_upload(request):
    uploader = request.user.username
    file_name = request.GET['file_name'][:150]
    file_type = request.GET['file_type']
    file_extension = file_type.split('/')[-1]
    unique_file_name = file_name + '_' + str(time())
    s3_key = 'thumbnails/%s/%s.%s' % (
        uploader, unique_file_name, file_extension)
    return presign_s3_upload(
        raw_key=s3_key, file_name=file_name, file_type=file_type, acl="public-read")

# TODO: Replace with is_co_owner_or_owner
def volunteer_operation_is_authorized(request, volunteer_relation):
    project_volunteers = VolunteerRelation.objects.filter(project=volunteer_relation.project)
    authorized_usernames = ([volunteer_relation.project.project_creator.username]
        + list(map(lambda co: co.volunteer.username, list(filter(lambda v: v.is_co_owner, project_volunteers)))))
    return request.user.username in authorized_usernames


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
    email_subject = '{firstname} {lastname} would like to connect with {project}'.format(
                    firstname=user.first_name,
                    lastname=user.last_name,
                    project=project.project_name)
    email_template = HtmlEmailTemplate(use_signature=False)\
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
            message=message,
            firstname=user.first_name,
            lastname=user.last_name))\
        .paragraph('To contact this person, email them at {email}'.format(email=user.email))
    send_to_project_owners(project=project, sender=user, subject=email_subject, template=email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_volunteers(request, project_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)

    body = json.loads(request.body)
    subject = body['subject']
    message = body['message']

    project = Project.objects.get(id=project_id)
    if not user.email_verified or not is_co_owner_or_owner(user, project):
        return HttpResponse(status=403)

    volunteers = VolunteerRelation.get_by_project(project)

    email_subject = '{project}: {subject}'.format(
        project=project.project_name,
        subject=subject)
    email_template = HtmlEmailTemplate(use_signature=False) \
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
        message=message,
        firstname=user.first_name,
        lastname=user.last_name)) \
        .paragraph('To reply, email at {email}'.format(email=user.email))
    for volunteer in volunteers:
        # TODO: See if we can send emails in a batch
        # https://docs.djangoproject.com/en/2.2/topics/email/#topics-sending-multiple-emails
        send_to_project_volunteer(volunteer, email_subject, email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_volunteer(request, application_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    project = volunteer_relation.project

    body = json.loads(request.body)
    subject = body['subject']
    message = body['message']

    # TODO: Condense common code between this and contact_project_volunteers
    if not user.email_verified or not is_co_owner_or_owner(user, project):
        return HttpResponse(status=403)

    email_subject = '{project}: {subject}'.format(
        project=project.project_name,
        subject=subject)
    email_template = HtmlEmailTemplate(use_signature=False) \
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
        message=message,
        firstname=user.first_name,
        lastname=user.last_name)) \
        .paragraph('To reply, email at {email}'.format(email=user.email))
    send_to_project_volunteer(volunteer_relation, email_subject, email_template)
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
    volunteer_relation = VolunteerRelation.create(
        project=project,
        volunteer=user,
        projected_end_date=projected_end_date,
        role=role,
        application_text=message)
    send_volunteer_application_email(volunteer_relation)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def renew_volunteering_with_project(request, application_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)

    if not user.id == volunteer_relation.volunteer.id:
        return HttpResponse(status=403)

    body = json.loads(request.body)
    volunteer_relation.projected_end_date = body['projectedEndDate']
    volunteer_relation.re_enrolled_last_date = timezone.now()
    volunteer_relation.re_enroll_reminder_count = 0
    volunteer_relation.re_enroll_last_reminder_date = None
    volunteer_relation.save()

    notify_project_owners_volunteer_renewed_email(volunteer_relation, body['message'])
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def conclude_volunteering_with_project(request, application_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)

    if not user.id == volunteer_relation.volunteer.id:
        return HttpResponse(status=403)

    send_volunteer_conclude_email(user, volunteer_relation.project.project_name)

    body = json.loads(request.body)
    volunteer_relation.delete()

    notify_project_owners_volunteer_concluded_email(volunteer_relation, body['message'])
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def accept_project_volunteer(request, application_id):
    # Redirect to login if not logged in
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn, {'prev': request.get_full_path()}))

    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    about_project_url = section_url(FrontEndSection.AboutProject, {'id': str(volunteer_relation.project.id)})
    if volunteer_relation.is_approved:
        messages.add_message(request, messages.ERROR, 'This volunteer has already been approved.')
        return redirect(about_project_url)

    if volunteer_operation_is_authorized(request, volunteer_relation):
        # Set approved flag
        volunteer_relation.is_approved = True
        volunteer_relation.approved_date = timezone.now()
        volunteer_relation.save()
        update_project_timestamp(request, volunteer_relation.project)
        if request.method == 'GET':
            messages.add_message(request, messages.SUCCESS, volunteer_relation.volunteer.full_name() + ' has been approved as a volunteer.')
            return redirect(about_project_url)
        else:
            return HttpResponse(status=200)
    else:
        messages.add_message(request, messages.ERROR, 'You do not have permission to approve this volunteer.')
        return redirect(about_project_url)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def promote_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if volunteer_operation_is_authorized(request, volunteer_relation):
        # Set co_owner flag
        volunteer_relation.is_co_owner = True
        volunteer_relation.save()
        update_project_timestamp(request, volunteer_relation.project)
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def reject_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if volunteer_operation_is_authorized(request, volunteer_relation):
        body = json.loads(request.body)
        message = body['rejection_message']
        email_template = HtmlEmailTemplate()\
        .paragraph('The project owner of {project_name} has declined your application for the following reason:'.format(project_name=volunteer_relation.project.project_name))\
        .paragraph('\"{message}\"'.format(message=message))
        email_subject = 'Your application to join {project_name}'.format(
            project_name=volunteer_relation.project.project_name)
        send_to_project_volunteer(volunteer_relation=volunteer_relation,
                                  subject=email_subject,
                                  template=email_template)
        update_project_timestamp(request, volunteer_relation.project)
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def dismiss_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if volunteer_operation_is_authorized(request, volunteer_relation):
        body = json.loads(request.body)
        message = body['dismissal_message']
        email_template = HtmlEmailTemplate()\
        .paragraph('The owner of {project_name} has removed you from the project for the following reason:'.format(
            project_name=volunteer_relation.project.project_name))\
        .paragraph('\"{message}\"'.format(message=message))
        email_subject = 'You have been dismissed from {project_name}'.format(
            project_name=volunteer_relation.project.project_name)
        send_to_project_volunteer(volunteer_relation=volunteer_relation,
                               subject=email_subject,
                               template=email_template)
        update_project_timestamp(request, volunteer_relation.project)
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def demote_project_volunteer(request, application_id):
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if volunteer_operation_is_authorized(request, volunteer_relation):
        volunteer_relation.is_co_owner = False
        volunteer_relation.save()
        update_project_timestamp(request, volunteer_relation.project)
        body = json.loads(request.body)
        message = body['demotion_message']
        email_template = HtmlEmailTemplate()\
        .paragraph('The owner of {project_name} has removed you as a co-owner of the project for the following reason:'.format(
            project_name=volunteer_relation.project.project_name))\
        .paragraph('\"{message}\"'.format(message=message))
        email_subject = 'You have been removed as a co-owner from {project_name}'.format(
            project_name=volunteer_relation.project.project_name)
        send_to_project_volunteer(volunteer_relation=volunteer_relation,
                               subject=email_subject,
                               template=email_template)
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
        if len(message) > 0:
            email_template = HtmlEmailTemplate()\
            .paragraph('{volunteer_name} is leaving {project_name} for the following reason:'.format(
                volunteer_name=volunteer_relation.volunteer.full_name(),
                project_name=volunteer_relation.project.project_name))\
            .paragraph('\"{message}\"'.format(message=message))
        else:
            email_template = HtmlEmailTemplate() \
                .paragraph('{volunteer_name} is leaving {project_name} for unspecified reasons.'.format(
                volunteer_name=volunteer_relation.volunteer.full_name(),
                project_name=volunteer_relation.project.project_name))
        email_subject = '{volunteer_name} is leaving {project_name}'.format(
            volunteer_name=volunteer_relation.volunteer.full_name(),
            project_name=volunteer_relation.project.project_name)
        send_to_project_owners(project=volunteer_relation.project,
                               sender=volunteer_relation.volunteer,
                               subject=email_subject,
                               template=email_template)
        update_project_timestamp(request, volunteer_relation.project)
        volunteer_relation.delete()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()

def update_project_timestamp(request, project):
    if not request.user.is_staff:
        project.update_timestamp()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_group_owner(request, group_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    body = json.loads(request.body)
    message = body['message']

    group = Group.objects.get(id=group_id)
    email_subject = '{firstname} {lastname} would like to connect with {group}'.format(
        firstname=user.first_name,
        lastname=user.last_name,
        group=group.group_name)
    email_template = HtmlEmailTemplate(use_signature=False) \
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
        message=message,
        firstname=user.first_name,
        lastname=user.last_name)) \
        .paragraph('To contact this person, email them at {email}'.format(email=user.email))
    send_to_group_owners(group=group, sender=user, subject=email_subject, template=email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def invite_project_to_group(request, group_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    group = Group.objects.get(id=group_id)
    if not is_creator(user, group):
        return HttpResponse(status=403)

    body = json.loads(request.body)
    project = Project.objects.get(id=body['projectId'])
    message = body['message']
    project_relation = ProjectRelationship.create(group, project, message)
    project_relation.save()
    send_group_project_invitation_email(project_relation)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def accept_group_invitation(request, invite_id):
    # Redirect to login if not logged in
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn, {'prev': request.get_full_path()}))

    project_relation = ProjectRelationship.objects.get(id=invite_id)
    project = project_relation.relationship_project
    about_project_url = section_url(FrontEndSection.AboutProject, {'id': str(project.id)})
    if project_relation.is_approved:
        messages.add_message(request, messages.ERROR, 'The project is already part of the group.')
        return redirect(about_project_url)

    user = get_request_contributor(request)
    if is_co_owner_or_owner(user, project):
        # Set approved flag
        project_relation.is_approved = True
        project_relation.save()
        update_project_timestamp(request, project)
        if request.method == 'GET':
            messages.add_message(request, messages.SUCCESS, 'Your project is now part of the group ' + project_relation.relationship_group.group_name)
            return redirect(about_project_url)
        else:
            return HttpResponse(status=200)
    else:
        messages.add_message(request, messages.ERROR, 'You do not have permission to accept this group invitation.')
        return redirect(about_project_url)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def reject_group_invitation(request, invite_id):
    # Redirect to login if not logged in
    if not request.user.is_authenticated():
        return redirect(section_url(FrontEndSection.LogIn, {'prev': request.get_full_path()}))

    project_relation = ProjectRelationship.objects.get(id=invite_id)
    project = project_relation.relationship_project
    about_project_url = section_url(FrontEndSection.AboutProject, {'id': str(project.id)})
    if project_relation.is_approved:
        messages.add_message(request, messages.ERROR, 'The project is already part of the group.')
        return redirect(about_project_url)

    user = get_request_contributor(request)
    if is_co_owner_or_owner(user, project):
        project_relation.delete()
        update_project_timestamp(request, project)
        if request.method == 'GET':
            # TODO: Add messaging of some kind to front end
            return redirect(about_project_url)
        else:
            return HttpResponse(status=200)
    else:
        messages.add_message(request, messages.ERROR, 'You do not have permission to reject this group invitation.')
        return redirect(about_project_url)


#This will ask Google if the recaptcha is valid and if so send email, otherwise return an error.
#TODO: Return text strings to be displayed on the front end so we know specifically what happened
@csrf_exempt
def contact_democracylab(request):
    #first prepare all the data from the request body
    body = json.loads(request.body)
    # submit validation request to recaptcha
    r = requests.post(
      'https://www.google.com/recaptcha/api/siteverify',
      data={
        'secret': settings.GR_SECRETKEY,
        'response': body['reCaptchaValue']
      }
    )

    if r.json()['success']:
        # Successfuly validated, send email
        fn = body['fname']
        ln = body['lname']
        em = body['emailaddr']
        ms = body['message']
        contact_democracylab_email(fn, ln, em ,ms)
        return HttpResponse(status=200)

    # Error while verifying the captcha, do not send the email
    return HttpResponse(status=401)


def robots(request):
    template = loader.get_template('robots.txt')
    context = {
        'PROTOCOL_DOMAIN': settings.PROTOCOL_DOMAIN,
        'DISALLOW_CRAWLING': settings.DISALLOW_CRAWLING
    }

    return HttpResponse(template.render(context, request))


def team(request):
    response = {
        'board_of_directors': settings.BOARD_OF_DIRECTORS
    }

    if settings.DLAB_PROJECT_ID is not None:
        project = Project.objects.get(id=settings.DLAB_PROJECT_ID)
        response['project'] = project.hydrate_to_json()

    return JsonResponse(response)
