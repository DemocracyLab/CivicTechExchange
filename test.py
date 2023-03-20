'''

from django.test import TestCase
from common.helpers.queue import conn

class RedisConnectionTestCase(TestCase):
    def test_redis_connection(self):
        try:
            conn.ping()
        except Exception as e:
            self.fail(f"Failed to connect to Redis: {e}")
'''
