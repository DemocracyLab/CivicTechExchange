from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            'event_id'
        )

    def handle(self, *args, **options):
        from civictechprojects.models import Event
        event = Event.get_by_id_or_slug(options['event_id'])
        event_projects = event.get_event_projects()
        event.is_activated = False
        event.save()
        event.recache()
        for ep in event_projects:
            ep.recache()
