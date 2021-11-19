import os

import redis
from rq import Worker, Queue, Connection
from django.conf import settings

listen = ['default']

redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')

conn = redis.from_url(redis_url)

if __name__ == '__main__':
    settings.configure()
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()