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


def cache_tags():
    from civictechprojects.caching.cache import ProjectSearchTagsCache
    # Just cache the full tags call.  The tags calls filtered by event are taken care of by cache_events
    ProjectSearchTagsCache.refresh(event=None)


class Command(BaseCommand):
    def handle(self, *args, **options):
        cache_projects()
        cache_events()
        cache_tags()