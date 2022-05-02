from django.core.management.base import BaseCommand
from salesforce import volunteer_job, volunteer_hours


class Command(BaseCommand):
    def handle(self, *args, **options):
        volunteer_hours.import_hours()
