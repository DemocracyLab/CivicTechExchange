from django.conf import settings
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand
from django.utils import timezone
from democracylab.emails import send_email,_get_account_from_email, HtmlEmailTemplate


class Command(BaseCommand):
    def handle(self, *args, **options):
        print('Sending test renewal email')
        test_email_msg = Command.get_test_email_from_template(self)

        send_email(test_email_msg, email_acct=settings.EMAIL_SUPPORT_ACCT, is_html=True)

    def get_test_email_from_template(self):
        html_template = HtmlEmailTemplate() \
            .header("You're making a difference at {{project_name}}") \
            .paragraph("We'd like to take this opportunity to thank you for your support since {{volunteer_start_date}}.  "
                       "Your engagement with {{project_name}} is extremely important to us and is much appreciated.") \
            .paragraph("That said, we know you’re busy and just wanted to take this time to remind you that your "
                       "volunteer commitment with {{project_name}} will expire on {{project_end_date}}.") \
            .paragraph("We hope that you’ll take this time to renew your volunteer commitment and remain a part of our community.") \
            .button(url='https://democracy-lab-prod-mirror.herokuapp.com/index/?section=MyProjects',
                    text='REVIEW COMMITMENT')

        # TODO: Add end template to support single line break
        context = {
            'first_name': 'Test User',
            'project_name': 'Test Project',
            'project_end_date': "9/9/99",
            'volunteer_start_date': '1/1/11'
        }

        test_email_msg = EmailMessage(
            subject="You're making a difference at Test Project",
            from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
            to=[settings.ADMIN_EMAIL],
        )

        test_email_msg = html_template.render(test_email_msg, context)

        return test_email_msg
