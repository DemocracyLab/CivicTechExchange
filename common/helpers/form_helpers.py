import json
from common.helpers.collections import find_first
from common.models.tags import Tag


def read_form_field_string(model, form, field_name):
    if field_name in form.data:
        setattr(model, field_name, form.data.get(field_name))


def merge_tag_changes(model, form, field_name):
    if field_name in form.data:
        Tag.merge_tags_field(getattr(model, field_name), form.data.get(field_name))


def merge_json_changes(model_class, model, form, field_name):
    if field_name in form.data:
        json_text = form.data.get(field_name)
        if len(json_text) > 0:
            json_object = json.loads(json_text)
            model_class.merge_changes(model, json_object)


def merge_single_file(model, form, file_category, field_name):
    from civictechprojects.models import ProjectFile
    if field_name in form.data:
        file_json = json.loads(form.data.get(field_name))
        ProjectFile.replace_single_file(model, file_category, file_json)


def is_json_field_empty(field_json):
    if isinstance(field_json, dict):
        return len(field_json.keys()) == 0
    else:
        return len(field_json) == 0


def is_creator(user, project):
    return user.username == project.project_creator.username


def is_co_owner(user, project):
    from civictechprojects.models import VolunteerRelation
    volunteer_relations = VolunteerRelation.objects.filter(project_id=project.id, volunteer_id=user.id)
    co_owner_relationship = find_first(volunteer_relations, lambda volunteer_relation: volunteer_relation.is_co_owner)
    return co_owner_relationship is not None


def is_co_owner_or_staff(user, project):
    if user is not None:
        return is_creator(user, project) or is_co_owner(user, project) or user.is_staff


def is_creator_or_staff(user, project):
    return is_creator(user, project) or user.is_staff
