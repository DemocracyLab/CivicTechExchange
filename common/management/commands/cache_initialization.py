from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from democracylab.emails import send_volunteer_application_email


class Command(BaseCommand):
    def handle(self, *args, **options):
        from civictechprojects.models import Project
        projects_to_cache = Project.objects.filter(is_searchable=True, deleted=False)
        for project in projects_to_cache:
            project.recache()
