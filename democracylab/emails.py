from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.template import loader, Template, Context
from enum import Enum
from html.parser import unescape
from common.models.tags import Tag
from democracylab.models import Contributor
from civictechprojects.models import VolunteerRelation
from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url


class EmailSection(Enum):
    Header = 'Header'
    Button = 'Button'
    Paragraph = 'Paragraph'


class HtmlEmailTemplate:
    base_template = loader.get_template('html_email_frame.html')
    section_templates = {
        EmailSection.Header: loader.get_template('html_email_header.html'),
        EmailSection.Button: loader.get_template('html_email_button.html'),
        EmailSection.Paragraph: loader.get_template('html_email_paragraph.html')
    }

    def __init__(self):
        self.sections = []
        self.hydrated_template = None

    def add(self, section_type, section_content):
        self.sections.append(HtmlEmailTemplate.section_templates[section_type].render(section_content))
        return self

    def header(self, text):
        return self.add(EmailSection.Header, {'text': text})

    def paragraph(self, text):
        return self.add(EmailSection.Paragraph, {'text': text})

    def button(self, url, text):
        return self.add(EmailSection.Button, {'url': url, 'text': text})

    def render(self, email_msg, context=None):
        if self.hydrated_template is None:
            sections_text = ''.join(self.sections)
            self.hydrated_template = Template(HtmlEmailTemplate.base_template.render({"content": sections_text}))
        email_msg.content_subtype = "html"
        # For some reason xml markup characters in the template (<,>) get converted to entity codes (&lt; and &rt;)
        # We unescape to convert the markup characters back
        email_msg.body = unescape(self.hydrated_template.render(Context(context or {})))
        return email_msg


def send_verification_email(contributor):
    # Get token
    user = Contributor.objects.get(id=contributor.id)
    verification_token = default_token_generator.make_token(user)
    verification_url = settings.PROTOCOL_DOMAIN + '/verify_user/' + str(contributor.id) + '/' + verification_token
    # Send email with token
    email_template = HtmlEmailTemplate()\
        .header('Welcome to DemocracyLab')\
        .paragraph('Please click here to confirm your email address')\
        .button(url=verification_url, text='Confirm Email Address')
    email_msg = EmailMessage(
        subject='Welcome to DemocracyLab',
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=[contributor.email]
    )
    email_msg = email_template.render(email_msg)
    send_email(email_msg, settings.EMAIL_SUPPORT_ACCT)


def send_password_reset_email(contributor):
    # Get token
    user = Contributor.objects.get(id=contributor.id)
    reset_parameters = {
        'userId': contributor.id,
        'token': default_token_generator.make_token(user)
    }
    reset_url = section_url(FrontEndSection.ChangePassword, reset_parameters)
    print(reset_url)
    # Send email with token
    email_msg = EmailMessage(
        subject='DemocracyLab Password Reset',
        body='Click here to change your password: ' + reset_url,
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=[contributor.email]
    )
    send_email(email_msg, settings.EMAIL_SUPPORT_ACCT)


def send_project_creation_notification(project):
    project_url = settings.PROTOCOL_DOMAIN + '/index/?section=AboutProject&id=' + str(project.id)
    email_msg = EmailMessage(
        subject='New DemocracyLab Project: ' + project.project_name,
        body='{first_name} {last_name}({email}) has created the project "{project_name}": \n {project_url}'.format(
            first_name=project.project_creator.first_name,
            last_name=project.project_creator.last_name,
            email=project.project_creator.email,
            project_name=project.project_name,
            project_url=project_url
        ),
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=[settings.ADMIN_EMAIL]
    )
    send_email(email_msg, settings.EMAIL_SUPPORT_ACCT)


def send_to_project_owners(project, sender, subject, body):
    project_volunteers = VolunteerRelation.objects.filter(project=project.id)
    co_owner_emails = list(map(lambda co: co.volunteer.email, list(filter(lambda v: v.is_co_owner, project_volunteers))))
    email_msg = EmailMessage(
        subject=subject,
        body=body,
        from_email=_get_account_from_email(settings.EMAIL_VOLUNTEER_ACCT),
        to=[project.project_creator.email] + co_owner_emails,
        reply_to=[sender.email]
    )
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)


def send_to_project_volunteer(volunteer_relation, subject, body):
    project_volunteers = VolunteerRelation.objects.filter(project=volunteer_relation.project.id)
    co_owner_emails = list(map(lambda co: co.volunteer.email, list(filter(lambda v: v.is_co_owner, project_volunteers))))
    email_msg = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_VOLUNTEER_ACCT['from_name'],
        to=[volunteer_relation.volunteer.email],
        reply_to=[volunteer_relation.project.project_creator.email] + co_owner_emails,
    )
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)


def send_volunteer_application_email(volunteer_relation, is_reminder=False):
    project = volunteer_relation.project
    user = volunteer_relation.volunteer
    role_details = Tag.from_field(volunteer_relation.role)
    role_text = "{subcategory}: {name}".format(subcategory=role_details.subcategory, name=role_details.display_name)
    project_profile_url = settings.PROTOCOL_DOMAIN + '/index/?section=AboutProject&id=' + str(project.id)
    email_subject = '{is_reminder}{firstname} {lastname} would like to volunteer with {project} as {role}'.format(
        is_reminder='REMINDER: ' if is_reminder else '',
        firstname=user.first_name,
        lastname=user.last_name,
        project=project.project_name,
        role=role_text)
    email_body = '{message} \n -- \n To review this volunteer, see {url}'.format(
        message=volunteer_relation.application_text,
        user=user.email,
        url=project_profile_url)
    send_to_project_owners(project=project, sender=user, subject=email_subject, body=email_body)


def send_email(email_msg, email_acct=None):
    if not settings.FAKE_EMAILS:
        email_msg.connection = email_acct['connection'] if email_acct is not None else settings.EMAIL_SUPPORT_ACCT['connection']
        email_msg.send()
    else:
        test_email_subject = 'TEST EMAIL: ' + email_msg.subject
        test_email_body = 'Environment:{environment}\nTO: {to_line}\nREPLY-TO: {reply_to}\n---\n{body}'.format(
            environment=settings.PROTOCOL_DOMAIN,
            to_line=email_msg.to,
            reply_to=email_msg.reply_to,
            body=email_msg.body
        )
        test_email_msg = EmailMessage(
            subject=test_email_subject,
            body=test_email_body,
            to=[settings.ADMIN_EMAIL]
        )
        test_email_msg.send()


def _get_account_from_email(email_acct):
    return email_acct['from_name'] if email_acct is not None else 'DemocracyLab'
