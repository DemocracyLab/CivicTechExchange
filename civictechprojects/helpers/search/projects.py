from urllib import parse as urlparse
from django.conf import settings
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector, TrigramSimilarity
from django.core.paginator import Paginator
from django.db.models.functions import Greatest
from .common import apply_tag_filters, sort_by_field, apply_tag_filters_for_search
from civictechprojects.caching.cache import ProjectSearchTagsCache
from civictechprojects.helpers.projects.annotations import apply_project_annotations
from civictechprojects.models import Project, Group, Event, ProjectPosition, ProjectFavorite
from common.helpers.db import unique_column_values
from common.helpers.tags import get_tags_by_category
from common.models.tags import Tag
from democracylab.models import Contributor, get_request_contributor


def projects_list(request):
    url_parts = request.GET.urlencode()
    query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    event = None
    group = None

    if 'group_id' in query_params:
        group_id = query_params['group_id'][0]
        group = Group.objects.get(id=group_id)
        project_list = group.get_group_projects(approved_only=True)
    elif 'event_id' in query_params:
        event_id = query_params['event_id'][0]
        event = Event.get_by_id_or_slug(event_id)
        project_list = event.get_linked_projects()
    else:
        project_list = Project.objects.filter(is_searchable=True, is_private=False)

    project_list = apply_tag_filters(project_list, query_params, 'issues', projects_by_issue_areas)
    project_list = apply_tag_filters(project_list, query_params, 'tech', projects_by_technologies)
    project_list = apply_tag_filters(project_list, query_params, 'role', projects_by_roles)
    project_list = apply_tag_filters(project_list, query_params, 'org', projects_by_orgs)
    project_list = apply_tag_filters(project_list, query_params, 'orgType', projects_by_org_types)
    project_list = apply_tag_filters(project_list, query_params, 'stage', projects_by_stage)

    if 'favoritesOnly' in query_params:
        user = get_request_contributor(request)
        project_list = project_list & ProjectFavorite.get_for_user(user)

    if 'keyword' in query_params:
        # project_list = project_list & projects_by_keyword(query_params['keyword'][0])

        keywords = query_params['keyword'][0]

        project_search_primary = project_list.annotate(
            similarity=Greatest(
                TrigramSimilarity('project_name', keywords),
                TrigramSimilarity('project_description', keywords),
                TrigramSimilarity('project_city', keywords),
                TrigramSimilarity('full_text', keywords),
            )
        ).filter(similarity__gt=0.2).order_by('-similarity')

        tags = Tag.objects.annotate(
            similarity=TrigramSimilarity('tag_name', keywords),
        ).filter(similarity__gt=0.3).order_by('-similarity')

        tag_names = tags.values_list('tag_name', flat=True)

        projects_search_issues = apply_tag_filters_for_search(project_list, tag_names, projects_by_issue_areas)
        projects_search_technologies = apply_tag_filters_for_search(project_list, tag_names, projects_by_technologies)
        projects_search_roles = apply_tag_filters_for_search(project_list, tag_names, projects_by_roles)
        projects_search_orgs = apply_tag_filters_for_search(project_list, tag_names, projects_by_orgs)
        projects_search_org_types = apply_tag_filters_for_search(project_list, tag_names, projects_by_org_types)

        projects_search_final = project_search_primary | projects_search_issues | projects_search_technologies | projects_search_roles | projects_search_orgs | projects_search_org_types

        project_list = projects_search_final

    if 'locationRadius' in query_params:
        project_list = projects_by_location(project_list, query_params['locationRadius'][0])

    if 'location' in query_params:
        project_list = projects_by_legacy_city(project_list, query_params['location'][0])

    project_list = project_list.distinct()

    if 'sortField' in query_params:
        project_list = sort_by_field(project_list, query_params['sortField'][0])
    else:
        project_list = sort_by_field(project_list, '-project_date_modified')

    project_count = len(project_list)

    project_paginator = Paginator(project_list, settings.PROJECTS_PER_PAGE)

    if 'page' in query_params:
        project_list_page = project_paginator.page(query_params['page'][0])
        project_pages = project_paginator.num_pages
    else:
        project_list_page = project_list
        project_pages = 1

    tag_counts = get_tag_counts(category=None, event=event, group=group)
    response = projects_with_meta_data(get_request_contributor(request), query_params, project_list_page, project_pages, project_count, tag_counts)

    return response


def recent_projects_list(request):
    url_parts = request.GET.urlencode()
    query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    project_count = int(query_params['count'][0]) if 'count' in query_params else 3
    project_list = Project.objects.filter(is_searchable=True, is_private=False)
    # Filter out the DemocracyLab project
    if settings.DLAB_PROJECT_ID.isdigit():
        project_list = project_list.exclude(id=int(settings.DLAB_PROJECT_ID))
    project_list = sort_by_field(project_list, '-project_date_modified')[:project_count]
    return list(project.hydrate_to_tile_json() for project in project_list)


def projects_by_keyword(keyword):
    return Project.objects.filter(full_text__icontains=keyword)


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
    positions = ProjectPosition.objects.filter(position_role__name__in=tags) \
        .exclude(position_event__isnull=False).select_related('position_project')

    # Get the list of projects linked to those roles
    return Project.objects.filter(positions__in=positions)


def project_countries():
    return unique_column_values(Project, 'project_country', lambda country: country and len(country) == 2)


def projects_with_meta_data(user: Contributor, query_params, projects, project_pages, project_count, tag_counts):
    projects_json = apply_project_annotations(user, query_params, [project.hydrate_to_tile_json() for project in projects])
    return {
        'projects': projects_json,
        'availableCountries': project_countries(),
        'tags': tag_counts,
        'numPages': project_pages,
        'numProjects': project_count
    }


def get_tag_counts(category=None, event=None, group=None):
    queryset = get_tags_by_category(category) if category is not None else Tag.objects.all()
    activetagdict = ProjectSearchTagsCache.get(event=event, group=group)
    querydict = {tag.tag_name: tag for tag in queryset}
    resultdict = {}

    for slug in querydict.keys():
        resultdict[slug] = Tag.hydrate_tag_model(querydict[slug])
        resultdict[slug]['num_times'] = activetagdict[slug] if slug in activetagdict else 0
    return list(resultdict.values())
