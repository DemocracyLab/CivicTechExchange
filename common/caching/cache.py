from django.core.cache import cache
from enum import Enum


class CacheKeys(Enum):
    ProjectTagCounts = 'project_tag_counts'


class CacheWrapper:
    _cache_generators = {}

    def __init__(self, cache_backend):
        self._cache = cache_backend

    def get(self, key, generator_func):
        """
        Retrieve cached value, and cache the value if it is not already cached
        :param key: Key of value to retrieve
        :param generator_func: Function that generates value
        :return: Value mapped to key
        """
        return self._cache.get(key) or self._set(key, generator_func)

    def refresh(self, key):
        """
        Refresh the cached value for a given key, such as when the underlying data has changed
        :param key: Key of value to re-cache
        """
        self._cache.set(key, self._cache_generators[key]() if key in self._cache_generators else None)

    def _set(self, key, generator_func):
        if generator_func is not None:
            self._cache_generators[key] = generator_func
        generated_value = self._cache_generators[key]()
        self._cache.set(key, generated_value)
        return generated_value


Cache = CacheWrapper(cache)
