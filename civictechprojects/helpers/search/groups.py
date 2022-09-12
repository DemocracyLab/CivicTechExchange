from urllib import parse as urlparse
from django.conf import settings
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.core.paginator import Paginator
from django.db.models import Q
from .common import apply_tag_filters, sort_by_field
from civictechprojects.models import Group, ProjectRelationship
from common.helpers.constants import TagCategory
from common.helpers.db import unique_column_values
from common.models.tags import Tag


def groups_list(request):
    url_parts = request.GET.urlencode()
    query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    group_list = Group.objects.filter(is_searchable=True, is_private=False)

    if request.method == 'GET':
        group_list = group_list & apply_tag_filters(group_list, query_params, 'issues', groups_by_issue_areas)
        if 'keyword' in query_params:
            group_list = group_list & groups_by_keyword(query_params['keyword'][0])

        if 'locationRadius' in query_params:
            group_list = groups_by_location(group_list, query_params['locationRadius'][0])

        group_list = group_list.distinct()

        if 'sortField' in query_params:
            group_list = sort_by_field(group_list, query_params['sortField'][0])
        else:
            group_list = sort_by_field(group_list, 'group_name')

        group_count = len(group_list)

        group_paginator = Paginator(group_list, settings.PROJECTS_PER_PAGE)

        if 'page' in query_params:
            group_list_page = group_paginator.page(query_params['page'][0])
            group_pages = group_paginator.num_pages
        else:
            group_list_page = group_list
            group_pages = 1

        return groups_with_meta_data(group_list_page, group_pages, group_count)


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
    group_relationships = ProjectRelationship.objects.exclude(relationship_group=None) \
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
