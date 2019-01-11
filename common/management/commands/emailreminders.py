from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from democracylab.emails import send_volunteer_application_email

# TODO: Make this configurable
# This array specifies how many days we should space our reminder emails.  In this case, the first reminder comes after
# two days, and then repeats every seven days


class Command(BaseCommand):
    def handle(self, *args, **options):
        from civictechprojects.models import VolunteerRelation
        pending_volunteer_applications = VolunteerRelation.objects.filter(is_approved=False)
        for volunteer in pending_volunteer_applications:
            if time_for_reminder(volunteer):
                send_volunteer_application_email(volunteer, is_reminder=True)
                volunteer.reminder_count += 1
                volunteer.last_reminder_date = timezone.now()
                volunteer.save()


def time_for_reminder(volunteer):
    reminder_interval_days = settings.APPLICATION_REMINDER_PERIODS or [2, 7]

    time_of_application_or_reminder = volunteer.last_reminder_date or volunteer.application_date
    days_since_last_reminder = (timezone.now() - time_of_application_or_reminder).days
    days_to_next_reminder = reminder_interval_days[min(volunteer.reminder_count, len(reminder_interval_days) - 1)]
    return days_since_last_reminder >= days_to_next_reminder
