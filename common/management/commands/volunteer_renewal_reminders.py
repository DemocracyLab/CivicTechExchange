from django.conf import settings
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand
from django.template import loader
from django.utils import timezone
from democracylab.emails import send_email,_get_account_from_email


class Command(BaseCommand):
    def handle(self, *args, **options):
        print('Sending test renewal email')
        template = loader.get_template('volunteer_renew_alert_1.html')
        context = {
            'first_name': 'Test User',
            'project_name': 'Test Project',
            'project_end_date': "9/9/99",
            'volunteer_start_date': '1/1/11'
        }
        body = template.render(context)

        test_email_msg = EmailMessage(
            subject="You're making a difference",
            body=body,
            from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
            to=[settings.ADMIN_EMAIL],
        )

        send_email(test_email_msg, email_acct=settings.EMAIL_SUPPORT_ACCT, is_html=True)
