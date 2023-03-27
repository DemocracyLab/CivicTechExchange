'''
import os
from django.test import TestCase
from common.helpers import queue
import redis.exceptions

class RedisConnectionTestCase(TestCase):
    @staticmethod
    def test_function():
        return "Test successful"

    def test_redis_connection(self):
        try:
            job = queue.enqueue(self.test_function)
            if job is not None:
                job_result = job.result
                self.assertEqual(job_result, "Test successful")
            else:
                self.fail("Job is not enqueued properly")
        except redis.exceptions.RedisError as e:
            self.fail(f"Connection error: {str(e)}")
'''

import os
from django.test import TestCase
from common.helpers import queue
import redis.exceptions

class RedisConnectionTestCase(TestCase):
    @staticmethod
    def test_function():
        return "Test successful"

    def test_redis_secure_connection(self):
        if not os.getenv('REDIS_URL'):
            self.skipTest("REDIS_URL environment variable not set")

        try:
            redis_url = os.environ['REDIS_URL']
            is_secure = redis_url.startswith('rediss://')
            if not is_secure:
                self.skipTest("This test only runs with a secure Redis URL (rediss://)")

            job = queue.enqueue(self.test_function)
            if job is not None:
                job_result = job.result
                self.assertEqual(job_result, "Test successful")
            else:
                self.fail("Job is not enqueued properly")
        except redis.exceptions.RedisError as e:
            self.fail(f"Connection error: {str(e)}")
