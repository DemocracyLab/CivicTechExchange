import re
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
from .models import FileCategory, Project, ProjectFile, ProjectPosition, UserAlert, VolunteerRelation, Group, Event, \
    ProjectRelationship, Testimonial, ProjectFavorite, EventProject, RSVPVolunteerRelation, EventConferenceRoom, \
    EventConferenceRoomParticipant
from .sitemaps import SitemapPages
from .caching.cache import ProjectSearchTagsCache
from .helpers.search.groups import groups_list
from .helpers.search.projects import projects_list, recent_projects_list
from common.caching.cache import Cache
from common.helpers.collections import flatten, count_occurrences
from common.helpers.db import unique_column_values
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.helpers.tags import get_tags_by_category,get_tag_dictionary
from common.helpers.form_helpers import is_co_owner_or_staff, is_co_owner, is_co_owner_or_owner, is_creator_or_staff, is_creator
from .forms import ProjectCreationForm, EventCreationForm, GroupCreationForm, EventProjectCreationForm
from common.helpers.qiqo_chat import get_user_qiqo_iframe
from democracylab.models import Contributor, get_request_contributor
from common.models.tags import Tag
from common.helpers.constants import FrontEndSection, TagCategory
from democracylab.emails import send_to_project_owners, send_to_project_volunteer, HtmlEmailTemplate, send_volunteer_application_email, \
    send_volunteer_conclude_email, notify_project_owners_volunteer_renewed_email, notify_project_owners_volunteer_concluded_email, \
    notify_project_owners_project_approved, contact_democracylab_email, send_to_group_owners, send_group_project_invitation_email, \
    notify_group_owners_group_approved, notify_event_owners_event_approved, notify_rsvped_volunteer, notify_rsvp_cancellation, \
    notify_rsvp_for_project_owner, notify_rsvp_cancellation_for_project_owner, notify_rsvp_cancellation_for_event_owner
from civictechprojects.helpers.context_preload import context_preload
from civictechprojects.helpers.projects.annotations import apply_project_annotations
from common.helpers.front_end import section_url, get_page_section, get_clean_url, redirect_from_deprecated_url
from common.helpers.redirectors import redirect_by, InvalidArgumentsRedirector, DirtyUrlsRedirector, DeprecatedUrlsRedirector
from common.helpers.user_helpers import get_my_projects, get_my_groups, get_my_events, get_user_context
from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from salesforce import campaign as salesforce_campaign, volunteer_hours as salesforce_volunteer, contact as salesforce_contact
import requests


def tags(request):
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    category = query_terms.get('category')[0] if 'category' in query_terms else None
    queryset = get_tags_by_category(category) if category is not None else Tag.objects.all()
    tags_result = list(map(lambda tag: Tag.hydrate_tag_model(tag), queryset))
    return JsonResponse(tags_result, safe=False)


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


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def group_create(request):
    if not request.user.is_authenticated:
        return redirect(section_url(FrontEndSection.LogIn))

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    group = GroupCreationForm.create_or_edit_group(request, None)
    return JsonResponse(group.hydrate_to_json())


def group_edit(request, group_id):
    if not request.user.is_authenticated:
        return redirect('/signup')

    group = None
    try:
        group = GroupCreationForm.create_or_edit_group(request, group_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    if request.is_ajax():
        return JsonResponse(group.hydrate_to_json())
    else:
        return redirect(section_url(FrontEndSection.AboutGroup, {'id': group_id}))


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def group_delete(request, group_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    try:
        GroupCreationForm.delete_group(request, group_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_group(request, group_id):
    group = Group.get_by_id_or_slug(group_id)

    if group is not None:
        is_staff = is_co_owner_or_staff(get_request_contributor(request), group)

        if group.is_private and group_id.isnumeric() and not is_staff:
            # If private event isn't accessed for slug, don't show to non-admins
            return HttpResponse(status=404)

        if group.is_searchable or is_creator_or_staff(get_request_contributor(request), group):
            return JsonResponse(group.hydrate_to_json())
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


def approve_group(request, group_id):
    group = Group.objects.get(id=group_id)
    user = get_request_contributor(request)

    if group is not None:
        if user.is_staff:
            group.is_searchable = True
            group.save()
            # SitemapPages.update()
            ProjectSearchTagsCache.refresh(event=None, group=group)
            notify_group_owners_group_approved(group)
            messages.success(request, 'Group Approved')
            group.group_creator.purge_cache()

            return redirect(section_url(FrontEndSection.AboutGroup, {'id': str(group.id)}))
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def event_create(request):
    if not request.user.is_authenticated:
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
    if not request.user.is_authenticated:
        return redirect('/signup')

    event = None
    try:
        event = EventCreationForm.create_or_edit_event(request, event_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    if request.is_ajax():
        return JsonResponse(event.hydrate_to_json())
    else:
        return redirect(section_url(FrontEndSection.AboutEvent, {'id': event_id}))


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def event_delete(request, event_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    try:
        EventCreationForm.delete_event(request, event_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_event(request, event_id):
    try:
        event = Event.get_by_id_or_slug(event_id)
        if event_id.isnumeric() and event.is_private and not is_creator_or_staff(get_request_contributor(request), event):
            # Don't let non-admins/non-owners load a private event by numeric id
            raise PermissionDenied()
    except PermissionDenied:
        return HttpResponseForbidden()

    return JsonResponse(event.hydrate_to_json(get_request_contributor(request))) if event else HttpResponse(status=404)


def get_event_project(request, event_id, project_id):
    try:
        event_project = EventProject.get(event_id, project_id)
    except PermissionDenied:
        return HttpResponseForbidden()

    return JsonResponse(event_project.hydrate_to_json(get_request_contributor(request))) if event_project else HttpResponse(status=404)


def event_project_edit(request, event_id, project_id):
    if not request.user.is_authenticated:
        return redirect(section_url(FrontEndSection.LogIn))

    event_project = EventProjectCreationForm.create_or_edit_event_project(request, event_id, project_id)
    return JsonResponse(event_project.hydrate_to_json())


def rsvp_for_event(request, event_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    event = Event.get_by_id_or_slug(event_id)
    RSVPVolunteerRelation.create(event, user)

    notify_rsvped_volunteer(event, user)
    user.purge_cache()
    return HttpResponse(status=200)


def cancel_rsvp_for_event(request, event_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    event = Event.get_by_id_or_slug(event_id)
    rsvp = RSVPVolunteerRelation.get_for_event_volunteer(event, user)
    rsvp.delete()

    notify_rsvp_cancellation(event, user)
    user.purge_cache()
    return HttpResponse(status=200)


def rsvp_for_event_project(request, event_id, project_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    event = Event.get_by_id_or_slug(event_id)
    event_project = EventProject.get(event_id, project_id)

    # If rsvp already created, do nothing
    rsvp = RSVPVolunteerRelation.get_for_event_project(event_project, user)
    if rsvp is None:
        rsvp = RSVPVolunteerRelation.create(event, user)
        body = json.loads(request.body)
        rsvp.event_project = event_project
        rsvp.application_text = body['applicationText']
        rsvp.save()
        rsvp.role.add(body['roleTag'])

        notify_rsvp_for_project_owner(rsvp)
        user.purge_cache()

    return JsonResponse(event_project.recache())


def cancel_rsvp_for_event_project(request, event_id, project_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    event = Event.get_by_id_or_slug(event_id)
    event_project = EventProject.get(event_id, project_id)
    rsvp = RSVPVolunteerRelation.get_for_event_project(event_project, user)
    if event_project.is_owner(user):
        # If event project owner, delete event project
        project = event_project.project
        event_project.delete()
        event.recache()
        project.recache()
        user.purge_cache()
        notify_rsvp_cancellation_for_event_owner(event_project)
        return HttpResponse(status=200)
    elif rsvp is not None:
        # If rsvp-ed, delete rsvp
        notify_rsvp_cancellation_for_project_owner(rsvp)
        rsvp.delete()
        rsvp.event_project.recache()
        user.purge_cache()
        return JsonResponse(event_project.recache())
    else:
        return HttpResponse(status=401)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def project_create(request):
    if not request.user.is_authenticated:
        return redirect(section_url(FrontEndSection.LogIn))

    user = get_request_contributor(request)
    if not user.email_verified:
        # TODO: Log this
        return HttpResponse(status=403)

    project = ProjectCreationForm.create_or_edit_project(request, None)
    return JsonResponse(project.hydrate_to_json())


def project_edit(request, project_id):
    if not request.user.is_authenticated:
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
        return redirect(section_url(FrontEndSection.AboutProject, {'id': project_id}))


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def project_delete(request, project_id):
    # if not logged in, send user to login page
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    try:
        ProjectCreationForm.delete_project(request, project_id)
    except PermissionDenied:
        return HttpResponseForbidden()
    return HttpResponse(status=204)


def get_project(request, project_id):
    project = Project.get_by_id_or_slug(project_id)

    if project is not None:
        is_staff = is_co_owner_or_staff(get_request_contributor(request), project)

        if project.is_private and project_id.isnumeric() and not is_staff:
            # If private event isn't accessed for slug, don't show to non-admins
            return HttpResponse(status=404)

        if project.is_searchable or is_staff:
            url_parts = request.GET.urlencode()
            query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
            hydrated_project = project.hydrate_to_json()
            if 'includeVolunteers' not in query_params:
                del hydrated_project['project_volunteers']
            return JsonResponse(hydrated_project, safe=False)
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


def approve_project(request, project_id):
    project = Project.objects.filter(id=project_id).first()
    if project is None:
        # Restore deleted project
        project = Project.archives.filter(id=project_id).first()
    user = get_request_contributor(request)

    if project is not None:
        if user.is_staff:
            restored_from_archive = project.deleted
            message = 'Project Approved' if not restored_from_archive else 'Project Restored from Archive'
            project.is_searchable = True
            project.deleted = False
            project.save()
            salesforce_campaign.create(project)
            project.recache(recache_linked=True)
            ProjectSearchTagsCache.refresh()
            project.project_creator.purge_cache()
            SitemapPages.update()
            if not restored_from_archive:
                notify_project_owners_project_approved(project)
            messages.success(request, message)
            return redirect(section_url(FrontEndSection.AboutProject, {'id': project_id}))
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


def approve_event(request, event_id):
    event = Event.objects.get(id=event_id)
    user = get_request_contributor(request)

    if event is not None:
        if user.is_staff:
            event.is_searchable = True
            event.save()
            notify_event_owners_event_approved(event)
            event.update_linked_items()
            event.event_creator.purge_cache()
            messages.success(request, 'Event Approved')
            return redirect(section_url(FrontEndSection.AboutEvent, {'id': str(event.id)}))
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


@ensure_csrf_cookie
@xframe_options_exempt
@api_view()
@throttle_classes([AnonRateThrottle, UserRateThrottle])
def index(*args, **kwargs):
    request = args[0]
    # id = kwargs['id'] // Uncomment if this is ever needed
    page = get_page_section(request.get_full_path())
    # TODO: Add to redirectors.py
    # Redirect to AddUserDetails page if First/Last name hasn't been entered yet
    if page not in [FrontEndSection.AddUserDetails.value, FrontEndSection.SignUp.value] \
            and request.user.is_authenticated and \
            (not request.user.first_name or not request.user.last_name):
        from allauth.socialaccount.models import SocialAccount
        account = SocialAccount.objects.filter(user=request.user).first()
        return redirect(section_url(FrontEndSection.AddUserDetails, {'provider': account.provider}))

    redirect_result = redirect_by([InvalidArgumentsRedirector, DirtyUrlsRedirector, DeprecatedUrlsRedirector], request.get_full_path())
    if redirect_result is not None:
        return redirect(redirect_result)

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
        'DONATE_PAGE_BLURB': settings.DONATE_PAGE_BLURB,
        'HEAP_ANALYTICS_ID': settings.HEAP_ANALYTICS_ID
    }
    if settings.HOTJAR_APPLICATION_ID:
        context['hotjarScript'] = loader.render_to_string('scripts/hotjar_snippet.txt',
                                                          {'HOTJAR_APPLICATION_ID': settings.HOTJAR_APPLICATION_ID})

    GOOGLE_CONVERSION_ID = None
    context = context_preload(page, request, context)
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

    if hasattr(settings, 'GHOST_URL'):
        context['GHOST_URL'] = settings.GHOST_URL
        context['GHOST_CONTENT_API_KEY'] = settings.GHOST_CONTENT_API_KEY

    if request.user.is_authenticated:
        contributor = Contributor.objects.get(id=request.user.id)
        context['userContext'] = json.dumps(get_user_context(contributor))
        context['userID'] = request.user.id
        context['emailVerified'] = contributor.email_verified
        context['email'] = contributor.email
        context['firstName'] = contributor.first_name
        context['lastName'] = contributor.last_name
        context['isStaff'] = contributor.is_staff
        context['volunteeringUpForRenewal'] = contributor.is_up_for_volunteering_renewal()
        context['QIQO_IFRAME_URL'] = get_user_qiqo_iframe(contributor, request)

        # TODO: Get thumbnail from cached user
        thumbnail = ProjectFile.objects.filter(file_user=request.user.id,
                                               file_category=FileCategory.THUMBNAIL.value).first()
        if thumbnail:
            context['userImgUrl'] = thumbnail.file_url
    else:
        context['userContext'] = '{}'

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


def project_search(request):
    response = projects_list(request)
    return JsonResponse(response)


def recent_projects(request):
    if request.method == 'GET':
        projects_list = recent_projects_list(request)
        return JsonResponse({'projects': projects_list})


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
            <location>{cdata(", ".join([project.project_city, project.project_state]) if (project.project_city and project.project_state) else "")}</location>
            <city>{cdata(project.project_city)}</city>
            <state>{cdata(project.project_state)}</state>
            <country>{cdata(project.project_country)}</country>
            <applyUrl>{cdata(position.description_url or project.project_url)}</applyUrl>
            <industryCodes><industryCode>{cdata("4")}</industryCode></industryCodes>
        </job>
        """

    approved_projects = ProjectPosition.objects.filter(position_project__is_searchable=True)\
        .exclude(position_event__isnull=False)
    xml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
    <source>
        <lastBuildDate>{timezone.now().strftime('%a, %d %b %Y %H:%M:%S %Z')}</lastBuildDate> 
        <publisherUrl>https://www.democracylab.org</publisherUrl>
        <publisher>DemocracyLab</publisher>
        {"".join(map(position_to_job, approved_projects))}
    </source>"""

    return HttpResponse(xml_response, content_type="application/xml")


def group_search(request):
    response = groups_list(request)
    return JsonResponse(response)


def events_list(request):
    events = Event.objects.filter(is_created=True, is_searchable=True, is_private=False)
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

def get_project_volunteers(request,project_id):
    project = Project.objects.get(id=project_id)
    if project is not None:
        if project.is_searchable or is_co_owner_or_staff(get_request_contributor(request), project):
            data = {
                'project_id' : project_id,
                'project_volunteers': project.hydrate_to_json()['project_volunteers']
            }
            return JsonResponse(data, safe=False)
        else:
            return HttpResponseForbidden()
    else:
        return HttpResponse(status=404)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_owner(request, project_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        return HttpResponse(status=403)

    body = json.loads(request.body)
    message = body['message']

    project = Project.objects.get(id=project_id)
    email_subject = '{firstname} {lastname} sent a message to {project}'.format(
                    firstname=user.first_name,
                    lastname=user.last_name,
                    project=project.project_name)
    email_template = HtmlEmailTemplate(use_signature=False)\
        .subheader('Your project has a new message.')\
        .paragraph('{firstname} {lastname} has sent the following message to {project}'.format(
            firstname=user.first_name,
            lastname=user.last_name,
            project= project.project_name))\
        .paragraph('\"{message}\"'.format(message=message))\
        .paragraph('To respond, you can reply to this email')
    send_to_project_owners(project=project, sender=user, subject=email_subject, template=email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_volunteers(request, project_id):
    if not request.user.is_authenticated:
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
        .header('You have a new message from {projectname}'.format(projectname=project.project_name)) \
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
        message=message,
        firstname=user.first_name,
        lastname=user.last_name)) \
        .paragraph('To respond, you can reply to this email.')

    # Send to project owner if co-owner initiated
    if not is_creator(user, project):
        volunteers = list(filter(lambda vr: vr.volunteer.id != user.id, volunteers))
        send_to_project_owners(project, user, email_subject, email_template, include_co_owners=False)

    for volunteer in volunteers:
        # TODO: See if we can send emails in a batch
        # https://docs.djangoproject.com/en/2.2/topics/email/#topics-sending-multiple-emails
        send_to_project_volunteer(volunteer, email_subject, email_template, cc_owners=False)

    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_project_volunteer(request, application_id):
    if not request.user.is_authenticated:
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
        .header('You have a new message from {projectname}'.format(projectname=project.project_name)) \
        .paragraph('\"{message}\" - {firstname} {lastname}'.format(
        message=message,
        firstname=user.first_name,
        lastname=user.last_name)) \
        .paragraph('To respond, you can reply to this email.')
    send_to_project_volunteer(volunteer_relation, email_subject, email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def volunteer_with_project(request, project_id):
    if not request.user.is_authenticated:
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
    salesforce_volunteer.create(volunteer_relation)
    send_volunteer_application_email(volunteer_relation)
    project.recache()
    user.purge_cache()
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def renew_volunteering_with_project(request, application_id):
    if not request.user.is_authenticated:
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
    volunteer_relation.volunteer.purge_cache()
    salesforce_volunteer.renew(volunteer_relation)

    notify_project_owners_volunteer_renewed_email(volunteer_relation, body['message'])
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def conclude_volunteering_with_project(request, application_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)

    if not user.id == volunteer_relation.volunteer.id:
        return HttpResponse(status=403)

    send_volunteer_conclude_email(user, volunteer_relation.project.project_name)

    body = json.loads(request.body)
    project = Project.objects.get(id=volunteer_relation.project.id)
    user = volunteer_relation.volunteer
    volunteer_relation.delete()
    salesforce_volunteer.conclude(volunteer_relation)
    project.recache()
    user.purge_cache()

    notify_project_owners_volunteer_concluded_email(volunteer_relation, body['message'])
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def accept_project_volunteer(request, application_id):
    # Redirect to login if not logged in
    if not request.user.is_authenticated:
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
        salesforce_volunteer.accept(volunteer_relation)
        volunteer_relation.volunteer.purge_cache()
        update_project_timestamp(request, volunteer_relation.project)
        volunteer_relation.project.recache()
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
        volunteer_relation.project.recache()
        volunteer_relation.volunteer.purge_cache()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def reject_project_volunteer(request, application_id):
    find_projects_page_url = section_url(FrontEndSection.FindProjects)
    volunteer_relation = VolunteerRelation.objects.get(id=application_id)
    if volunteer_operation_is_authorized(request, volunteer_relation):
        body = json.loads(request.body)
        message = body['rejection_message']
        email_template = HtmlEmailTemplate()\
        .paragraph('Hi {first_name},'.format(first_name=volunteer_relation.volunteer.first_name))\
        .paragraph('Thank you for your interest in volunteering with {project_name}.'.format(project_name=volunteer_relation.project.project_name))\
        .paragraph('Unfortunately, the project owner did not select you as a volunteer for this project.')\
        .paragraph('Message from the project owner: \"{message}\"'.format(message=message))\
        .paragraph('We hope you\'ll consider other volunteer opportunities at DemocracyLab.')\
        .button(url=find_projects_page_url, text='Explore More Projects')
        email_subject = 'Your volunteer application to join {project_name}'.format(
            project_name=volunteer_relation.project.project_name)
        send_to_project_volunteer(volunteer_relation=volunteer_relation,
                                  subject=email_subject,
                                  template=email_template)
        update_project_timestamp(request, volunteer_relation.project)
        project = Project.objects.get(id=volunteer_relation.project.id)
        user = volunteer_relation.volunteer
        volunteer_relation.delete()
        project.recache()
        user.purge_cache()
        salesforce_volunteer.delete(application_id)
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
        project = Project.objects.get(id=volunteer_relation.project.id)
        user = volunteer_relation.volunteer
        volunteer_relation.delete()
        salesforce_volunteer.dismiss(volunteer_relation)
        project.recache()
        user.purge_cache()
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
        volunteer_relation.project.recache()
        volunteer_relation.volunteer.purge_cache()
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
            .paragraph('{volunteer_name} is leaving {project_name} because:'.format(
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
        user = volunteer_relation.volunteer
        volunteer_relation.delete()
        salesforce_volunteer.conclude(volunteer_relation)
        project = Project.objects.get(id=project_id)
        project.recache()
        user.purge_cache()
        return HttpResponse(status=200)
    else:
        raise PermissionDenied()

def update_project_timestamp(request, project):
    if not request.user.is_staff:
        project.update_timestamp()


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def contact_group_owner(request, group_id):
    if not request.user.is_authenticated:
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
        .header('Your group has a new message.') \
        .paragraph('{firstname} {lastname} has sent the following message to {group}:'.format(
        firstname=user.first_name,
        lastname=user.last_name,
        group=group.group_name)) \
        .paragraph('\"\"{message}\"\"'.format(message=message)) \
        .paragraph('To respond, you can reply to this email.')
    send_to_group_owners(group=group, sender=user, subject=email_subject, template=email_template)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def invite_project_to_group(request, group_id):
    if not request.user.is_authenticated:
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
    is_approved = is_co_owner_or_owner(user, project)
    project_relation = ProjectRelationship.create(group, project, is_approved, message)
    project_relation.save()
    project_relation.relationship_project.recache()
    project_relation.relationship_group.recache()
    if not is_approved:
        send_group_project_invitation_email(project_relation)
    return HttpResponse(status=200)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def accept_group_invitation(request, invite_id):
    # Redirect to login if not logged in
    if not request.user.is_authenticated:
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
        project_relation.relationship_project.recache()
        project_relation.relationship_group.recache()
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
    if not request.user.is_authenticated:
        return redirect(section_url(FrontEndSection.LogIn, {'prev': request.get_full_path()}))

    project_relation = ProjectRelationship.objects.get(id=invite_id)
    project = project_relation.relationship_project
    about_project_url = section_url(FrontEndSection.AboutProject, {'id': str(project.id)})
    if project_relation.is_approved:
        messages.add_message(request, messages.ERROR, 'The project is already part of the group.')
        return redirect(about_project_url)

    user = get_request_contributor(request)
    if is_co_owner_or_owner(user, project):
        project = Project.objects.get(id=project_relation.relationship_project.id)
        project_relation.delete()
        update_project_timestamp(request, project)
        project.recache()
        if request.method == 'GET':
            # TODO: Add messaging of some kind to front end
            return redirect(about_project_url)
        else:
            return HttpResponse(status=200)
    else:
        messages.add_message(request, messages.ERROR, 'You do not have permission to reject this group invitation.')
        return redirect(about_project_url)


@csrf_exempt
def project_favorite(request, project_id):
    user = get_request_contributor(request)
    project = Project.objects.get(id=project_id)
    existing_fav = ProjectFavorite.get_for_project(project, user)
    if existing_fav is not None:
        print("Favoriting project:{project} by user:{user}".format(project=project.id, user=user.id))
        ProjectFavorite.create(user, project)
        user.purge_cache()
    else:
        print("Favorite already exists for project:{project}, user:{user}".format(project=project.id, user=user.id))
        return HttpResponse(status=400)
    return HttpResponse(status=200)


@csrf_exempt
def project_unfavorite(request, project_id):
    user = get_request_contributor(request)
    project = Project.objects.get(id=project_id)
    existing_fav = ProjectFavorite.get_for_project(project, user)
    if existing_fav is not None:
        print("Unfavoriting project:{project} by user:{user}".format(project=project.id, user=user.id))
        existing_fav.delete()
        user.purge_cache()
    else:
        print("Can't Unfavorite project:{project} by user:{user}".format(project=project.id, user=user.id))
        return HttpResponse(status=400)
    return HttpResponse(status=200)


#This will ask Google if the recaptcha is valid and if so send email, otherwise return an error.
#TODO: Return text strings to be displayed on the front end so we know specifically what happened
#TODO: Figure out why changing the endpoint to /api/contact/democracylab results in CSRF issues
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
        # Successfully validated, send email
        first_name = body['fname']
        last_name = body['lname']
        email_addr = body['emailaddr']
        message = body['message']
        company_name = body['company_name'] if 'company_name' in body else None
        interest_flags = list(filter(lambda key: body[key] and isinstance(body[key], bool), body.keys()))
        contact_democracylab_email(first_name, last_name, email_addr, message, company_name, interest_flags)
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


def redirect_v1_urls(request):
    page_url = request.get_full_path()
    print(page_url)
    clean_url = get_clean_url(page_url)
    section_match = re.findall(r'/index/\?section=(\w+)', clean_url)
    section_name = section_match[0] if len(section_match) > 0 else FrontEndSection.Home
    deprecated_redirect_url = redirect_from_deprecated_url(section_name)
    if deprecated_redirect_url:
        print('Redirecting deprecated url {name}: {url}'.format(name=section_name, url=clean_url))
        return redirect(deprecated_redirect_url)
    print('Redirecting v1 url: ' + clean_url)
    section_id_match = re.findall(r'&id=([\w-]+)', clean_url)
    section_id = section_id_match[0] if len(section_id_match) > 0 else ''
    return redirect(section_url(section_name, {'id': section_id}))


def get_testimonials(request, category=None):
    testimonials = Testimonial.objects.filter(active=True)
    if category:
        testimonials = testimonials.filter(categories__name__in=[category])

    return JsonResponse(list(map(lambda t: t.to_json(), testimonials.order_by('-priority'))), safe=False)


# TODO: Whitelist qiqochat for this hook
@csrf_exempt
def qiqo_webhook(request):
    from pprint import pprint
    body = json.loads(request.body)
    print('Zoom webhook payload:')
    pprint(body)
    action = body['event']
    payload = body['payload']
    obj = payload['object']
    room_id = obj['id']

    participant = obj['participant']
    participant_id = participant['user_id']
    participant_name = participant['user_name']

    existing_room = EventConferenceRoom.get_by_zoom_id(room_id)
    if not existing_room:
        print('Zoom room not found: ' + room_id)
        return HttpResponse(status=401)

    if action == 'meeting.participant_joined':
        existing_participant = EventConferenceRoomParticipant.get(existing_room, participant_id)
        if not existing_participant:
            existing_participant = EventConferenceRoomParticipant(
                room=existing_room,
                zoom_user_name=participant_name,
                zoom_user_id=participant_id,
                enter_date=timezone.now())
            existing_participant.save()
        else:
            print('User {user_id} has already joined room {room_id}'.format(user_id=participant_id, room_id=room_id))
            return HttpResponse(status=302)
    elif action == 'meeting.participant_left':
        existing_participant = EventConferenceRoomParticipant.get(existing_room, participant_id)
        if existing_participant:
            print('User {user_id} has left room {room_id}'.format(user_id=participant_id, room_id=room_id))
            existing_participant.delete()
        else:
            print('User {user_id} is not in {room_id}'.format(user_id=participant_id, room_id=room_id))
            return HttpResponse(status=302)
    else:
        print('Unrecognized action: ' + action)
        return HttpResponse(status=401)

    existing_room.recache_linked()
    return HttpResponse(status=200)