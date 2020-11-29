from django.core.management.base import BaseCommand


def cache_projects():
    from civictechprojects.models import Project
    projects_to_cache = Project.objects.filter(is_searchable=True, deleted=False)
    for project in projects_to_cache:
        project.recache()


def cache_events():
    from civictechprojects.models import Event
    events_to_cache = Event.objects.filter(is_searchable=True, deleted=False)
    for event in events_to_cache:
        event.recache()


class Command(BaseCommand):
    def handle(self, *args, **options):
        cache_projects()
        cache_events()