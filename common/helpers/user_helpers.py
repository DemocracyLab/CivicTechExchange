from civictechprojects.caching.cache import UserContextCache
from common.helpers.dictionaries import merge_dicts


def get_my_projects(contributor):
    from civictechprojects.models import Project
    owned_projects = Project.objects.filter(project_creator_id=contributor.id)
    volunteering_projects = contributor.volunteer_relations.all()
    response = {
        'owned_projects': [project.hydrate_to_list_json() for project in owned_projects],
        'volunteering_projects': volunteering_projects.exists() and list(map(lambda volunteer_relation: volunteer_relation.hydrate_project_volunteer_info(), volunteering_projects))
    }
    return response


def get_my_groups(contributor):
    from civictechprojects.models import Group
    owned_groups = Group.objects.filter(group_creator_id=contributor.id)
    response = {'owned_groups': [group.hydrate_to_list_json() for group in owned_groups]}
    return response


def get_my_events(contributor):
    from civictechprojects.models import Event
    owned_events = Event.objects.filter(event_creator_id=contributor.id)
    response = {
        'owned_events': [event.hydrate_to_list_json() for event in owned_events]
    }
    if contributor.is_staff:
        private_events = Event.objects.filter(is_private=True).exclude(event_creator_id=contributor.id)
        response['private_events'] = [event.hydrate_to_list_json() for event in private_events]
    return response


def get_user_favorites(contributor):
    from civictechprojects.models import ProjectFavorite
    fav_projects = ProjectFavorite.get_for_user(contributor)
    return {project.id: project.hydrate_to_tile_json() for project in fav_projects}


def get_rsvp_events(contributor):
    from civictechprojects.models import RSVPVolunteerRelation
    rsvp_events = RSVPVolunteerRelation.get_for_volunteer(contributor)
    list_rsvps = list(map(lambda rsvp: rsvp.to_json(), rsvp_events))
    return list_rsvps


def get_event_projects(contributor):
    from civictechprojects.models import EventProject
    created_event_projects = EventProject.get_owned(contributor)
    list_rsvps = list(map(lambda event_project: event_project.hydrate_to_list_json(), created_event_projects))
    return list_rsvps


def _get_user_context(contributor):
    user_context = merge_dicts(get_my_projects(contributor), get_my_groups(contributor), get_my_events(contributor))
    user_context['favorites'] = get_user_favorites(contributor)
    user_context['rsvp_events'] = get_rsvp_events(contributor)
    user_context['event_projects'] = get_event_projects(contributor)
    return user_context


def get_user_context(user):
    return UserContextCache.get(user) or UserContextCache.refresh(user, _get_user_context(user))


def clear_user_context(user):
    return UserContextCache.clear(user)

def is_user_blank_name(user):
    return user.full_name() is None or user.full_name() == "" or user.full_name().isspace()
