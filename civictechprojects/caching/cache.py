from collections import Counter
from common.caching.cache import Cache
from common.helpers.dictionaries import merge_dicts

class ProjectCacheManager:
    _cache_key_prefix = 'project_'

    def get(self, project):
        return Cache.get(self._get_key(project))

    def refresh(self, project, value):
        print('Re-caching project ' + str(project))
        Cache.refresh(self._get_key(project), value)
        return value

    def _get_key(self, project):
        from civictechprojects.models import Project
        project_id = str(project.id) if isinstance(project, Project) else project
        return self._cache_key_prefix + project_id


ProjectCache = ProjectCacheManager()


class EventCacheManager:
    _cache_key_prefix = 'event_'

    def get(self, project):
        return Cache.get(self._get_key(project))

    def refresh(self, event, value):
        print('Re-caching event ' + str(event))
        Cache.refresh(self._get_key(event), value)
        return value

    def _get_key(self, event):
        from civictechprojects.models import Event
        event_id = str(event.id) if isinstance(event, Event) else event
        return self._cache_key_prefix + event_id


EventCache = EventCacheManager()


# Caches the tag counts for project searches
class ProjectSearchTagsCacheManager:
    _cache_key_prefix = 'project_search_tags_'

    # Retrieve cached project tag counts for event (or all projects if event=None)
    def get(self, event=None):
        key = self._get_key(event)
        return Cache.get(key) or self.refresh(key)

    # Re-cache project tag counts for event (or all projects if event=None)
    def refresh(self, event=None):
        print('Re-caching tag counts' + (' for event:' + str(event.id) if event is not None else ''))
        value = self._projects_tag_counts(event)
        Cache.refresh(self._get_key(event), value)
        return value

    def _get_key(self, event):
        return self._cache_key_prefix + ('event_' + str(event.id) if event is not None else 'all')

    @staticmethod
    def _projects_tag_counts(event):
        from civictechprojects.models import Project, ProjectPosition
        projects = event.get_linked_projects() if event is not None else Project.objects.filter(is_searchable=True)
        issues, technologies, stage, organization, organization_type, positions = [], [], [], [], [], []
        if projects:
            for project in projects:
                issues += project.project_issue_area.slugs()
                technologies += project.project_technologies.slugs()
                stage += project.project_stage.slugs()
                organization += project.project_organization.slugs()
                organization_type += project.project_organization_type.slugs()

                project_positions = ProjectPosition.objects.filter(position_project=project.id)
                positions += map(lambda position: position.position_role.slugs()[0], project_positions)

            return merge_dicts(Counter(issues), Counter(technologies), Counter(stage), Counter(organization), Counter(organization_type), Counter(positions))


ProjectSearchTagsCache = ProjectSearchTagsCacheManager()