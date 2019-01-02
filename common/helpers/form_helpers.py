from common.helpers.collections import find_first


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
    return is_creator(user, project) or is_co_owner(user, project) or user.is_staff


def is_creator_or_staff(user, project):
    return is_creator(user, project) or user.is_staff
