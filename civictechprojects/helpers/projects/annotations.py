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
    def _get_event_videos(event_id):
        from civictechprojects.models import ProjectLink
        video_links = ProjectLink.objects.filter(link_event=event_id)
        video_links = {video_link.link_project.id: video_link.to_json() for video_link in video_links}
        return video_links

    def annotate(self, query_params, json_list):
        if 'event_id' in query_params:
            event_videos = self._get_event_videos(query_params['event_id'][0])
            for project_json in json_list:
                project_id = project_json['project_id']
                if project_id in event_videos:
                    project_json['project_thumbnail_video'] = event_videos[project_id]
        return json_list


_annotations = [EventVideosProjectAnnotation()]


def apply_project_annotations(query_params, json_list):
    for _annotation in _annotations:
        json_list = _annotation.annotate(query_params, json_list)
    return json_list
