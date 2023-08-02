from common.helpers.constants import FrontEndSection
from common.helpers.form_helpers import is_creator_or_staff
from common.helpers.front_end import section_url
from civictechprojects.caching.cache import EventProjectCache

class ProjectAnnotation:
    class Meta:
        abstract = True

    def annotate(self, user, query_params, json_list):
        """

        :param user             User making the query
        :param query_params:    Query parameters dictionary
        :param json_list:       Json list of projects
        :return:                Json project list with any added annotations
        """
        pass


class EventVideosProjectAnnotation(ProjectAnnotation):
    @staticmethod
    def _get_event_video(event_id, project_id):
        # TODO: Read from EventProject
        from civictechprojects.models import ProjectLink
        video_link = ProjectLink.objects.filter(link_event=event_id, link_project=project_id, link_name='link_video').first()
        if video_link:
            return video_link.to_json()

    def annotate(self, user, query_params, json_list):
        from civictechprojects.models import EventProject, EventConferenceRoom
        if 'event_id' in query_params:
            event_id = query_params['event_id'][0]
            for project_json in json_list:
                project_id = project_json['project_id']
                event_project = EventProject.get(event_id, project_id)
                event_project_json = EventProjectCache.get(event_project)
                if event_project_json:
                    project_json['project_positions'] = event_project_json['event_project_positions']
                project_json['card_url'] = section_url(FrontEndSection.AboutEventProject,
                                                       {'event_id': event_id, 'project_id': project_id})
                event_video = self._get_event_video(event_id, project_id)
                if event_video:
                    project_json['project_thumbnail_video'] = event_video
                if event_project.event.is_activated:
                    room = EventConferenceRoom.get_event_project_room(event_project)
                    if room is not None:
                        project_json['conference_url'] = room.admin_url if user and is_creator_or_staff(user, event_project) \
                            else room.join_url
                        project_json['conference_count'] = room.participant_count()
        return json_list


_annotations = [EventVideosProjectAnnotation()]


def apply_project_annotations(user, query_params, json_list):
    for _annotation in _annotations:
        json_list = _annotation.annotate(user, query_params, json_list)
    return json_list
