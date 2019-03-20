from django.conf import settings
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand
from django.utils import timezone
from democracylab.emails import send_email,_get_account_from_email, send_volunteer_conclude_email, HtmlEmailTemplate


class Command(BaseCommand):
    def handle(self, *args, **options):
        if not settings.VOLUNTEER_RENEW_REMINDER_PERIODS:
            print('Please set VOLUNTEER_RENEW_REMINDER_PERIODS before running volunteer_renewal_reminders')
            return

        now = timezone.now()

        from civictechprojects.models import VolunteerRelation
        approved_volunteer_applications = VolunteerRelation.objects.filter(is_approved=True)
        for volunteer_relation in approved_volunteer_applications:
            if volunteer_relation.is_up_for_renewal(now):
                if now > volunteer_relation.projected_end_date:
                    send_volunteer_conclude_email(volunteer_relation.volunteer, volunteer_relation.project.project_name)
                    # TODO: Send conclude email to project owners
                    volunteer_relation.delete()
                else:
                    email_template = get_reminder_template_if_time(now, volunteer_relation)
                    if email_template:
                        send_reminder_email(email_template, volunteer_relation)
                        volunteer_relation.re_enroll_reminder_count += 1
                        volunteer_relation.re_enroll_last_reminder_date = now
                        volunteer_relation.save()


def get_reminder_template_if_time(now, volunteer):
    reminder_interval_days = settings.VOLUNTEER_RENEW_REMINDER_PERIODS

    time_of_last_enroll_or_reminder = volunteer.re_enroll_last_reminder_date or volunteer.re_enrolled_last_date or volunteer.application_date
    days_since_last_reminder = (now - time_of_last_enroll_or_reminder).days
    days_to_next_reminder = reminder_interval_days[min(volunteer.re_enroll_reminder_count, len(reminder_interval_days) - 1)]
    return (days_to_next_reminder > 0) and (days_since_last_reminder >= days_to_next_reminder) and volunteer_reminder_emails[volunteer.re_enroll_reminder_count]


def send_reminder_email(email_template, volunteer_relation):
    project = volunteer_relation.project
    volunteer = volunteer_relation.volunteer
    # TODO: Format dates nicely
    context = {
        'first_name': volunteer.first_name,
        'project_name': project.project_name,
        'project_end_date': volunteer_relation.projected_end_date,
        'volunteer_start_date': volunteer_relation.application_date
    }

    email_msg = EmailMessage(
        subject="You're making a difference at " + project.project_name,
        from_email=_get_account_from_email(settings.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer.email],
    )

    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)


review_commitment_url = settings.PROTOCOL_DOMAIN + '/index/?section=MyProjects'


def get_first_email_template():
    return HtmlEmailTemplate() \
        .header("You're making a difference at {{project_name}}") \
        .paragraph("We'd like to take this opportunity to thank you for your support since {{volunteer_start_date}}.  "
                   "Your engagement with {{project_name}} is extremely important to us and is much appreciated.") \
        .paragraph("That said, we know you’re busy and just wanted to take this time to remind you that your "
                   "volunteer commitment with {{project_name}} will expire on {{project_end_date}}.") \
        .paragraph("We hope that you’ll take this time to renew your volunteer commitment and remain a part of our community.") \
        .button(url=review_commitment_url, text='REVIEW COMMITMENT')


def get_second_email_template():
    return HtmlEmailTemplate() \
        .header("You're essential to the success of {{project_name}}") \
        .paragraph("{{first_name}},") \
        .paragraph("We can't thank you enough for all the positive energy you're putting into our tech-for-good " 
                   "community, we wouldn't be able to do this without your help!") \
        .paragraph("We think you're a socially-conscious individual with a big heart and recognize that you're " 
                   "essential to the success of {{project_name}}.  We hope that you continue adding value to our " 
                   "community by taking this time to renew your volunteer commitment at {{project_name}}") \
        .button(url=review_commitment_url, text='RENEW TODAY')

volunteer_reminder_emails = [get_first_email_template(), get_second_email_template()]
