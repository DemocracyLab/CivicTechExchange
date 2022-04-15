from django.core.management.base import BaseCommand
from django.conf import settings
from common.helpers.qiqo_chat import activate_zoom_rooms, get_zoom_room_info


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
            activate_response = activate_zoom_rooms(qiqo_event_id, [room_id])
            for room_activation_json in activate_response:
                space_id = int(room_activation_json['space_id'])
                zoom_id = room_activation_json['zoom_meeting_id']
                room_json = get_zoom_room_info(qiqo_event_id, space_id)
                join_url = room_json['join_url']
                admin_url = room_json['start_url']
                event_project = event_project_index[space_id] if space_id != 0 else None
                print('Created room {room} for {entity}'.format(room=zoom_id, entity=(event_project or event).__str__()))
                EventConferenceRoom.create(event, zoom_id, join_url, admin_url, event_project)

        event.is_activated = True
        event.save()
        event.recache()
        for ep in event_projects:
            ep.recache()
