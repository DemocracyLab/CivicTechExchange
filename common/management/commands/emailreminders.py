from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

# TODO: Make this configurable
# This array specifies how many days we should space our reminder emails.  In this case, the first reminder comes after
# two days, and then repeats every seven days
reminder_interval_days = [2, 7]


class Command(BaseCommand):
    def handle(self, *args, **options):
        from civictechprojects.models import VolunteerRelation
        pending_volunteer_applications = VolunteerRelation.objects.filter(is_approved=False)
        for volunteer in pending_volunteer_applications:
            if time_for_reminder(volunteer):
                print("Pending application ", volunteer.__str__(), " should get a reminder")


def time_for_reminder(volunteer):
    time_of_application_or_reminder = volunteer.last_reminder_date or volunteer.application_date
    days_since_last_reminder = (timezone.now() - time_of_application_or_reminder).days
    days_to_next_reminder = reminder_interval_days[min(volunteer.reminder_count, len(reminder_interval_days) - 1)]
    return days_since_last_reminder >= days_to_next_reminder
