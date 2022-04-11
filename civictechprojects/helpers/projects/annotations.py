from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url

class ProjectAnnotation:
    class Meta:
        abstract = True

    def annotate(self, query_params, json_list):
        """

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

    def annotate(self, query_params, json_list):
        if 'event_id' in query_params:
            event_id = query_params['event_id'][0]
            for project_json in json_list:
                project_id = project_json['project_id']
                project_json['card_url'] = section_url(FrontEndSection.AboutEventProject,
                                                       {'event_id': event_id, 'project_id': project_id})
                event_video = self._get_event_video(event_id, project_id)
                if event_video:
                    project_json['project_thumbnail_video'] = event_video
        return json_list


_annotations = [EventVideosProjectAnnotation()]


def apply_project_annotations(query_params, json_list):
    for _annotation in _annotations:
        json_list = _annotation.annotate(query_params, json_list)
    return json_list
