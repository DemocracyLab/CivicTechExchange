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


def default_preload(context, query_args):
    context['title'] = 'DemocracyLab'
    context['description'] = 'Everyone has something to contribute to the technical solutions society needs. ' \
                             'Volunteer today to connect with other professionals volunteering their time.'
    context['og_type'] = 'website'
    context['og_image'] = settings.STATIC_CDN_URL + '/img/Democracylab_is_a_global_volunteer_tech_for_good_nonprofit.png'
    return context


preload_urls = [
    {'section': FrontEndSection.AboutProject.value, 'handler': about_project_preload},
    {'section': FrontEndSection.AboutUs.value, 'handler': about_us_preload}
]


def context_preload(section, query_args, context):
    handler = next((preload_url['handler'] for preload_url in preload_urls if preload_url['section'] == section), default_preload)
    return handler(context, query_args)

