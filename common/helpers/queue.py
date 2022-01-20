import os
import redis
import threading
from rq import Queue
from typing import Callable
from django.conf import settings

redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
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
