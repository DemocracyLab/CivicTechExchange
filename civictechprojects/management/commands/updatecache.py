# Scheduled tasks for Heroku Scheduler (or similar)
# currently, regenerates the views.py cache_page for tags(request)
from django.core.cache import cache
from django.core.management.base import BaseCommand
from django.conf import settings
import requests #requires pip install requests
class Command(BaseCommand):
    help = 'Refreshes API endpoint cache'

    def handle(self, *args, **options):
        #clear old cache values first - note that this will wipe the ENTIRE cache, if we start caching multiple views or other files this will need to be specifically wiping just the API endpoint cache
        cache.clear()
        #define endpoints
        endpoints = ['Issue(s) Addressed', 'Technologies Used', 'Role', 'Organization', 'Organization Type', 'Project Stage']
        #define URL parts for loop.
        #TODO: Get domain dynamically, not hardcoded.
        domain = settings.PROTOCOL_DOMAIN
        url1 = '/api/tags?category='
        url2 = '&getCounts=true'
        #HTTP GET to trigger caching in views.py (aka regenerate cached API endpoints)
        for category in endpoints:
            requests.get(domain + url1 + category + url2)
            self.stdout.write(self.style.SUCCESS('Successfully returned API endpoint: ' + category))
        self.stdout.write(self.style.SUCCESS('For domain: ' + domain))
