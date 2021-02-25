from django.core.cache import cache
from enum import Enum


class CacheWrapper:
    _cache_generators = {}

    def __init__(self, cache_backend):
        self._cache = cache_backend

    def get(self, key, generator_func=None):
        """
        Retrieve cached value, and cache the value if it is not already cached
        :param key: Key of value to retrieve
        :param generator_func: Function that generates value
        :return: Value mapped to key
        """
        print('Fetching key: ' + key)
        return self._cache.get(key) or (generator_func and self._set_with_generator(key, generator_func))

    def refresh(self, key, value=None):
        """
        Refresh the cached value for a given key, such as when the underlying data has changed
        :param key: Key of value to re-cache
        :param value: Value to cache
        """
        print('Re-caching key "{key}" with value: {value}'.format(key=key, value=value))
        _value = value or (self._cache_generators[key]() if key in self._cache_generators else None)
        self._cache.set(key, _value, timeout=None)

    def _set_with_generator(self, key, generator_func):
        if generator_func is not None:
            self._cache_generators[key] = generator_func
        generated_value = self._cache_generators[key]()
        self._cache.set(key, generated_value, timeout=None)
        return generated_value


Cache = CacheWrapper(cache)
