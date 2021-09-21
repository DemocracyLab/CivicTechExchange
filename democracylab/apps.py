from django.apps import AppConfig
from rq import Queue
from worker import conn

q = Queue(connection=conn)

class DemocracylabConfig(AppConfig):
    name = 'democracylab'

from models import update_linked_items

result = q.enqueue(update_linked_items, 'http://heroku.com')