from django.core.management.base import BaseCommand


def cache_projects():
    from civictechprojects.models import Project
    projects_to_cache = Project.objects.filter(is_searchable=True, deleted=False)
    for project in projects_to_cache:
        project.recache(recache_linked=False)


def cache_events():
    from civictechprojects.models import Event
    events_to_cache = Event.objects.filter(is_searchable=True, deleted=False)
    for event in events_to_cache:
        event.recache()

def cache_event_projects():
    from civictechprojects.models import EventProject
    events_projects_to_cache = EventProject.objects.filter(deleted=False)
    for event_project in events_projects_to_cache:
        event_project.recache()


def cache_groups():
    from civictechprojects.models import Group
    groups_to_cache = Group.objects.filter(is_searchable=True, deleted=False)
    for group in groups_to_cache:
        group.recache()


def cache_tags():
    from civictechprojects.caching.cache import ProjectSearchTagsCache
    # Just cache the full tags call.  The tags calls filtered by events/groups are handled above
    ProjectSearchTagsCache.refresh(event=None, group=None)


class Command(BaseCommand):
    def handle(self, *args, **options):
        cache_projects()
        cache_events()
        cache_event_projects()
        cache_groups()
        cache_tags()