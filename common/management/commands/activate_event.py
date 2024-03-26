from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            'event_id'
        )

    def handle(self, *args, **options):
        from civictechprojects.models import Event, EventConferenceRoom
        event = Event.get_by_id_or_slug(options['event_id'])
        # Room ids are keyed to project ids
        event_projects = event.get_event_projects()
        room_ids = [0] + list(map(lambda ep: ep.project.id, event_projects))
        event_project_index = {ep.project.id: ep for ep in event_projects}
        # TODO: Batch these calls properly when bug is fixed on Qiqochat's side
        qiqo_event_id = event.event_live_id
        for room_id in room_ids:
            event_project = event_project_index[room_id] if room_id != 0 else None
            EventConferenceRoom.create_for_entity(event, event_project)

        event.is_activated = True
        event.save()
        event.recache()
        for ep in event_projects:
            ep.recache()
