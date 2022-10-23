from civictechprojects.models import Project
from common.helpers.tags import get_tag_dictionary

def apply_tag_filters(project_list, query_params, param_name, tag_filter):
    if param_name in query_params:
        tag_dict = get_tag_dictionary()
        tags_to_filter_by = query_params[param_name][0].split(',')
        tags_to_filter_by = clean_nonexistent_tags(tags_to_filter_by, tag_dict)
        if len(tags_to_filter_by):
            project_list = project_list & tag_filter(tags_to_filter_by)

    return project_list


def apply_tag_filters_for_search(project_list, tags_to_filter_by, tag_filter):
    if len(tags_to_filter_by):
        tag_dict = get_tag_dictionary()
        tags_to_filter_by = clean_nonexistent_tags(tags_to_filter_by, tag_dict)
        project_list = project_list & tag_filter(tags_to_filter_by)
        return project_list
    else:
        return Project.objects.none()

def clean_nonexistent_tags(tags, tag_dict):
    return list(filter(lambda tag: tag in tag_dict, tags))


def sort_by_field(project_list, sort_field):
    return project_list.order_by(sort_field)