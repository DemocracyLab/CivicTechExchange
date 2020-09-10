from django.core.cache import cache
from enum import Enum


class CacheKeys(Enum):
    ProjectTagCounts = 'project_tag_counts'


class CacheWrapper:
    _cache_generators = {}

    def __init__(self, cache_backend):
        self._cache = cache_backend

    def get(self, key, generator_func):
        return self._cache.get(key) or self._set(key, generator_func)

    def refresh(self, key):
        self._cache.set(key, self._cache_generators[key]() if key in self._cache_generators else None)

    def _set(self, key, generator_func):
        if generator_func is not None:
            self._cache_generators[key] = generator_func
        generated_value = self._cache_generators[key]()
        self._cache.set(key, generated_value)
        return generated_value


Cache = CacheWrapper(cache)
