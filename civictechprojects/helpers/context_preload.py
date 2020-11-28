from django.conf import settings
from civictechprojects.caching.cache import ProjectCache
from common.helpers.constants import FrontEndSection


def about_project_preload(context, query_args):
    context = default_preload(context, query_args)
    project_id = query_args['id'][0]
    project_json = ProjectCache.get(project_id)
    if project_json is not None:
        context['title'] = project_json['project_name'] + ' | DemocracyLab'
        context['description'] = project_json['project_short_description'] or project_json['project_description'][:300]
        if 'project_thumbnail' in project_json:
            context['og_image'] = project_json['project_thumbnail']['publicUrl']
    else:
        print('Failed to preload project info, no cache entry found: ' + project_id)
    return context


def about_us_preload(context, query_args):
    context = default_preload(context, query_args)
    context['title'] = 'DemocracyLab | About'
    context['description'] = 'Learn About democracyLab, the nonprofit connecting skilled individuals to tech-for-good projects.'
    return context


def donate_preload(context, query_args):
    context = default_preload(context, query_args)
    context['title'] = 'Donate | DemocracyLab'
    context['description'] = 'We too are a nonprofit, and your tax-deductible gift helps us connect good people with good causes.'
    return context


def edit_profile_preload(context, query_args):
    context = default_preload(context, query_args)
    context['title'] = 'Update User Profile | DemocracyLab'
    context['description'] = 'Update User Profile page'
    return context


def create_event_preload(context, query_args):
    context = default_preload(context, query_args)
    context['title'] = 'Create an Event | DemocracyLab'
    context['description'] = 'Create event page'
    return context


def my_events_preload(context, query_args):
    context = default_preload(context, query_args)
    context['title'] = 'My Events | DemocracyLab'
    context['description'] = 'My Events page'
    return context


def default_preload(context, query_args):
    context['title'] = 'DemocracyLab'
    context['description'] = 'Everyone has something to contribute to the technical solutions society needs. ' \
                             'Volunteer today to connect with other professionals volunteering their time.'
    context['og_type'] = 'website'
    context['og_image'] = settings.STATIC_CDN_URL + '/img/Democracylab_is_a_global_volunteer_tech_for_good_nonprofit.png'
    return context


preload_urls = [
    {'section': FrontEndSection.AboutProject.value, 'handler': about_project_preload},
    {'section': FrontEndSection.EditProfile.value, 'handler': edit_profile_preload},
    {'section': FrontEndSection.AboutUs.value, 'handler': about_us_preload},
    {'section': FrontEndSection.CreateEvent.value, 'handler': create_event_preload},
    {'section': FrontEndSection.MyEvents.value, 'handler': my_events_preload},
    {'section': FrontEndSection.Donate.value, 'handler': donate_preload}
]


def context_preload(section, query_args, context):
    handler = next((preload_url['handler'] for preload_url in preload_urls if preload_url['section'] == section), default_preload)
    return handler(context, query_args)

