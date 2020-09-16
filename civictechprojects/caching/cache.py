from common.caching.cache import Cache


class ProjectCacheManager:
    _cache_key_prefix = 'project_'

    def get(self, project):
        return Cache.get(self._get_key(project))

    def refresh(self, project, value):
        Cache.refresh(self._get_key(project), value)
        return value

    def _get_key(self, project):
        return self._cache_key_prefix + str(project.id)


ProjectCache = ProjectCacheManager()
