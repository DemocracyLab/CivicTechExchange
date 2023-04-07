import os
import django
from rq import Worker, Queue, Connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'democracylab.settings')
django.setup()

with Connection():
    queue = Queue('default')
    worker = Worker(queue)
    worker.work()
