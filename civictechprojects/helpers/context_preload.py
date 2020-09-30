from django.conf import settings
from civictechprojects.models import Project
from common.helpers.constants import FrontEndSection


def about_project_preload(context, query_args):
    context = default_preload(context, query_args)
    project_id = query_args['id'][0]
    project = Project.objects.get(id=project_id)
    context['title'] = project.project_name + ' | DemocracyLab'
    context['description'] = project.project_short_description or project.project_description[:300]
    # TODO: Return project thumbnail if set
    return context


def default_preload(context, query_args):
    context['title'] = 'DemocracyLab'
    context['description'] = 'Everyone has something to contribute to the technical solutions society needs. ' \
                             'Volunteer today to connect with other professionals volunteering their time.'
    context['og_type'] = 'website'
    context['og_image'] = settings.STATIC_CDN_URL + '/img/Democracylab_is_a_global_volunteer_tech_for_good_nonprofit.png'
    return context


preload_urls = [
    {'section': FrontEndSection.AboutProject.value, 'handler': about_project_preload}
]


def context_preload(section, query_args, context):
    handler = next((preload_url['handler'] for preload_url in preload_urls if preload_url['section'] == section), default_preload)
    return handler(context, query_args)

