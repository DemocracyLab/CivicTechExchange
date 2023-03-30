
import os
from django.test import TestCase
from common.helpers import queue
import redis.exceptions
from django.conf import settings
print("hqd\n")
print(settings.REDIS_ENABLED)
class RedisConnectionTestCase(TestCase):
    @staticmethod
    def test_function():
        return "Test successful"
    def test_redis_connection(self):
        try:
            pong = queue.conn.ping()  # Send a PING command to the Redis server
            print("PING response:", pong)
        except redis.exceptions.RedisError as e:
            print("Error executing PING command:", str(e))
        try:
            job = queue.enqueue(self.test_function)
            if job is not None:
                self.assertIsNotNone(job)
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
'''

'''
import os
import redis
import ssl
from django.test import TestCase
from django.conf import settings
from common.helpers import queue

class RedisConnectionTestCase(TestCase):
    def test_redis_connection(self):
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')

        # Create an SSL context that allows self-signed certificates
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        # Update the Redis connection to use the custom SSL context
        conn = redis.from_url(redis_url, ssl=True, ssl_cert_reqs=None, ssl_ca_certs=None, ssl_certfile=None, ssl_keyfile=None, ssl_check_hostname=False, ssl_context=ssl_context)

        # A simple test job function
        def test_job(x, y):
            return x + y

        # Enqueue the test job using the custom SSL context
        job = queue.enqueue(test_job, 1, 2)

        # Assert that the job is not None, indicating that it was enqueued successfully
        self.assertIsNotNone(job)

'''