from common.caching.cache import Cache


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