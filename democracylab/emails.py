from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.template import loader, Template, Context
from enum import Enum
from html.parser import unescape
from common.models.tags import Tag
from common.helpers.date_helpers import DateTimeFormats, datetime_field_to_datetime, datetime_to_string
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
        .header("Hi {{first_name}}, we're glad you're here.")\
        .paragraph('Please confirm your email address by clicking the button below.')\
        .button(url=verification_url, text='VERIFY YOUR EMAIL')
    email_msg = EmailMessage(
        subject='Welcome to DemocracyLab',
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=[contributor.email]
    )
    email_msg = email_template.render(email_msg, {'first_name': user.first_name})
    send_email(email_msg, settings.EMAIL_SUPPORT_ACCT)


def send_password_reset_email(contributor):
    # Get token
    user = Contributor.objects.get(id=contributor.id)
    reset_parameters = {
        'userId': contributor.id,
        'token': default_token_generator.make_token(user)
    }
    reset_url = section_url(FrontEndSection.ChangePassword, reset_parameters)
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

    verification_url = settings.PROTOCOL_DOMAIN + '/projects/approve/' + str(project.id)
    email_template = HtmlEmailTemplate() \
        .paragraph('{first_name} {last_name}({email}) has created the project "{project_name}": \n {project_url}'.format(
            first_name=project.project_creator.first_name,
            last_name=project.project_creator.last_name,
            email=project.project_creator.email,
            project_name=project.project_name,
            project_url=project_url
        )) \
        .button(url=verification_url, text='APPROVE')
    email_msg = EmailMessage(
        subject='New DemocracyLab Project: ' + project.project_name,
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=[settings.ADMIN_EMAIL]
    )
    email_msg = email_template.render(email_msg)
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


volunteer_conclude_email_template = HtmlEmailTemplate() \
    .header("How has your experience been at {{project_name}}?") \
    .paragraph("Hi {{first_name}},") \
    .paragraph("We're always looking for ways to improve the connection between volunteers and tech-for-good projects.  " 
               "We've developed this super-short survey and we'd love to hear from you.  It will take less than a minute "
               "and will help us make DemocracyLab even better.") \
    .button(url=settings.VOLUNTEER_CONCLUDE_SURVEY_URL, text='TAKE OUR SURVEY')


def send_volunteer_conclude_email(volunteer, project_name):
    context = {
        'first_name': volunteer.first_name,
        'project_name': project_name,
    }
    email_msg = EmailMessage(
        subject="Tell us about your experience with " + project_name,
        from_email=_get_account_from_email(settings.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer.email],
    )
    email_msg = volunteer_conclude_email_template.render(email_msg, context)
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)

notify_volunteer_renewed_email_no_comment = HtmlEmailTemplate() \
    .paragraph("{{volunteer_name}} has renewed their volunteer commitment with {{project_name}} until {{projected_end_date}}.")

notify_volunteer_renewed_email_with_comments = HtmlEmailTemplate() \
    .paragraph("{{volunteer_name}} has renewed their volunteer commitment with {{project_name}} until {{projected_end_date}}, "
               "and would like to convey the following:") \
    .paragraph('"{{comments}}"')


def notify_project_owners_volunteer_renewed_email(volunteer_relation, comments):
    email_template = notify_volunteer_renewed_email_with_comments if comments else notify_volunteer_renewed_email_no_comment
    project_name = volunteer_relation.project.project_name
    projected_end_date = datetime_to_string(datetime_field_to_datetime(volunteer_relation.projected_end_date), DateTimeFormats.DATE_LOCALIZED)

    volunteer_name = volunteer_relation.volunteer.full_name()
    context = {
        'volunteer_name': volunteer_name,
        'project_name': project_name,
        'projected_end_date': projected_end_date,
        'comments': comments
    }
    email_msg = EmailMessage(
        subject=volunteer_name + " has renewed their volunteer commitment with " + project_name,
        from_email=_get_account_from_email(settings.EMAIL_VOLUNTEER_ACCT),
        to=_get_co_owner_emails(volunteer_relation.project)
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)


notify_volunteer_concluded_email_no_comment = HtmlEmailTemplate() \
    .paragraph("{{volunteer_name}} has concluded their volunteer commitment with {{project_name}}.")

notify_volunteer_concluded_email_with_comments = HtmlEmailTemplate() \
    .paragraph("{{volunteer_name}} has concluded their volunteer commitment with {{project_name}}, "
               "and would like to convey the following:") \
    .paragraph('"{{comments}}"')


def notify_project_owners_volunteer_concluded_email(volunteer_relation, comments=None):
    email_template = notify_volunteer_concluded_email_with_comments if comments else notify_volunteer_concluded_email_no_comment
    project_name = volunteer_relation.project.project_name

    volunteer_name = volunteer_relation.volunteer.full_name()
    context = {
        'volunteer_name': volunteer_name,
        'project_name': project_name,
        'comments': comments
    }
    email_msg = EmailMessage(
        subject=volunteer_name + " has concluded their volunteer commitment with " + project_name,
        from_email=_get_account_from_email(settings.EMAIL_VOLUNTEER_ACCT),
        to=_get_co_owner_emails(volunteer_relation.project)
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, settings.EMAIL_VOLUNTEER_ACCT)


def notify_project_owners_project_approved(project):
    email_template = HtmlEmailTemplate() \
        .paragraph('Your project "{{project_name}}" has been approved. You can see it at {{project_url}}')
    context = {
        'project_name': project.project_name,
        'project_url': settings.PROTOCOL_DOMAIN + '/index/?section=AboutProject&id=' + str(project.id)
    }
    email_msg = EmailMessage(
        subject=project.project_name + " has been approved",
        from_email=_get_account_from_email(settings.EMAIL_SUPPORT_ACCT),
        to=_get_co_owner_emails(project)
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, settings.EMAIL_SUPPORT_ACCT)


def send_email(email_msg, email_acct=None):
    if not settings.FAKE_EMAILS:
        email_msg.connection = email_acct['connection'] if email_acct is not None else settings.EMAIL_SUPPORT_ACCT['connection']
    else:
        test_email_subject = 'TEST EMAIL: ' + email_msg.subject
        test_email_body = '<!--\n Environment:{environment}\nTO: {to_line}\nREPLY-TO: {reply_to}\n -->\n{body}'.format(
            environment=settings.PROTOCOL_DOMAIN,
            to_line=email_msg.to,
            reply_to=email_msg.reply_to,
            body=email_msg.body
        )
        email_msg.subject = test_email_subject
        email_msg.body = test_email_body
        email_msg.to = [settings.ADMIN_EMAIL]
        if settings.EMAIL_SUPPORT_ACCT:
            email_msg.connection = settings.EMAIL_SUPPORT_ACCT['connection']
    email_msg.send()


def _get_co_owner_emails(project):
    return list(map(lambda co_owner: co_owner.email, project.all_owners()))


def _get_account_from_email(email_acct):
    return email_acct['from_name'] if email_acct is not None else 'DemocracyLab'
