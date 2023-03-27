'''
import os
import redis
import threading
from rq import Queue
from typing import Callable
from django.conf import settings

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)
q = settings.REDIS_ENABLED and Queue(connection=conn)


def enqueue(job_func: Callable, *args):
    if settings.REDIS_ENABLED:
        job = q.enqueue(job_func, *args)
        from pprint import pprint
        pprint(job)
        return job
    else:
        # If redis is not enabled, use thread
        thread = threading.Thread(target=job_func, args=args)
        thread.daemon = True
        thread.start()
'''

import os
import redis
import threading
from rq import Queue
from ssl import CERT_NONE
from typing import Callable
from django.conf import settings

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')

# Check if the Redis connection is using SSL
is_secure = redis_url.startswith('rediss://')

if is_secure:
    conn = redis.from_url(
        redis_url,
        ssl=True,
        ssl_ca_certs=None,
        ssl_cert_reqs=CERT_NONE,
    )
else:
    conn = redis.from_url(redis_url)

q = settings.REDIS_ENABLED and Queue(connection=conn)

def enqueue(job_func: Callable, *args):
    if settings.REDIS_ENABLED:
        job = q.enqueue(job_func, *args)
        from pprint import pprint
        pprint(job)
        return job
    else:
        # If redis is not enabled, use thread
        thread = threading.Thread(target=job_func, args=args)
        thread.daemon = True
        thread.start()
