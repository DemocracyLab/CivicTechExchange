from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

#TODO: Make this configurable
reminder_interval_days = [2, 7]


class Command(BaseCommand):
    def handle(self, *args, **options):
        print('Made it to emailreminders')
        from civictechprojects.models import VolunteerRelation
        pending_volunteer_applications = VolunteerRelation.objects.filter(is_approved=False)
        # for volunteer in pending_volunteer_applications:
            # days_since_last_reminder = (timezone.now - volunteer.last_reminder_date).days()
            # print(days_since_last_reminder, " days since last reminder for Volunteer Relation ", volunteer.id)
