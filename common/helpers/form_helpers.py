import json
from common.helpers.collections import find_first
from common.models.tags import Tag
from distutils.util import strtobool
from common.models import Project, Group 


def read_form_field_string(model, form, field_name, transformation=None):
    if field_name in form.data:
        form_field_content = form.data.get(field_name)
        if transformation is not None:
            form_field_content = transformation(form_field_content)
        setattr(model, field_name, form_field_content)


def read_form_field_boolean(model, form, field_name):
    read_form_field_string(model, form, field_name, lambda str: strtobool(str))


def read_form_field_tags(model, form, field_name):
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
        file_content = form.data.get(field_name)
        if file_content and len(file_content) > 0:
            file_json = json.loads(file_content)
            ProjectFile.replace_single_file(model, file_category, file_json)


def is_json_field_empty(field_json):
    if isinstance(field_json, dict):
        return len(field_json.keys()) == 0
    else:
        return len(field_json) == 0


def is_creator(user, entity):
    if type(entity) is Project:
        return user.username == entity.project_creator.username
    elif type(entity) is Group:
        return user.username == entity.group_creator.username
    else:
        return user.username == entity.event_creator.username

def is_co_owner(user, project):
    from civictechprojects.models import VolunteerRelation
    volunteer_relations = VolunteerRelation.objects.filter(project_id=project.id, volunteer_id=user.id)
    co_owner_relationship = find_first(volunteer_relations, lambda volunteer_relation: volunteer_relation.is_co_owner)
    return co_owner_relationship is not None

def is_co_owner_or_owner(user, project):
    return is_creator(user, project) or is_co_owner(user, project)

def is_co_owner_or_staff(user, project):
    if user is not None:
        return is_creator(user, project) or is_co_owner(user, project) or user.is_staff


def is_creator_or_staff(user, entity):
    return is_creator(user, entity) or user.is_staff
