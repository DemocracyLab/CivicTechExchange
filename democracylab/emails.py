from ast import List
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.template import loader, Template, Context
from django.utils import timezone
from enum import Enum
from html.parser import unescape
from common.models.tags import Tag
from common.helpers.date_helpers import (
    DateTimeFormats,
    datetime_field_to_datetime,
    datetime_to_string,
)
from common.helpers.queue import enqueue
from democracylab.tokens import email_verify_token_generator
from democracylab.models import Contributor
from civictechprojects.models import (
    Project,
    UserAlert,
    VolunteerRelation,
    EventProject,
    Event,
    RSVPVolunteerRelation,
)
from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url


class EmailSection(Enum):
    Header = "Header"
    Header_Left = "Header_Left"
    Subheader = "Subheader"
    Button = "Button"
    Paragraph = "Paragraph"
    Paragraph_Center = "Paragraph_Center"
    Text_Line = "Text_Line"


class Html:
    @staticmethod
    def a(href, text):
        return '<a href="{href}">{text}</a>'.format(href=href, text=text)


class HtmlEmailTemplate:
    base_template = loader.get_template("html_email_frame.html")
    section_templates = {
        EmailSection.Header: loader.get_template("html_email_header.html"),
        EmailSection.Header_Left: loader.get_template("html_email_headerleft.html"),
        EmailSection.Subheader: loader.get_template("html_email_subheader.html"),
        EmailSection.Button: loader.get_template("html_email_button.html"),
        EmailSection.Paragraph: loader.get_template("html_email_paragraph.html"),
        EmailSection.Paragraph_Center: loader.get_template(
            "html_email_paragraph_center.html"
        ),
        EmailSection.Text_Line: loader.get_template("html_email_text_line.html"),
    }

    def __init__(self, use_signature=True):
        self.use_signature = use_signature
        self.sections = []
        self.hydrated_template = None

    def add(self, section_type, section_content):
        self.sections.append(
            HtmlEmailTemplate.section_templates[section_type].render(section_content)
        )
        return self

    def header(self, text):
        return self.add(EmailSection.Header, {"text": text})

    def header_left(self, text):
        return self.add(EmailSection.Header_Left, {"text": text})

    def subheader(self, text):
        return self.add(EmailSection.Subheader, {"text": text})

    def paragraph(self, text):
        return self.add(EmailSection.Paragraph, {"text": text})

    def paragraph_center(self, text):
        return self.add(EmailSection.Paragraph_Center, {"text": text})

    def text_line(self, text):
        return self.add(EmailSection.Text_Line, {"text": text})

    def button(self, url, text):
        return self.add(EmailSection.Button, {"url": url, "text": text})

    def render(self, email_msg, context=None):
        if self.hydrated_template is None:
            sections_text = "".join(self.sections)
            content_context = {
                "content": sections_text,
                "use_signature": self.use_signature,
            }
            self.hydrated_template = Template(
                HtmlEmailTemplate.base_template.render(content_context)
            )
        email_msg.content_subtype = "html"
        # For some reason xml markup characters in the template (<,>) get converted to entity codes (&lt; and &rt;)
        # We unescape to convert the markup characters back
        _context = context or {}
        email_msg.body = unescape(self.hydrated_template.render(Context(_context)))
        return email_msg


class EmailAccount(Enum):
    EMAIL_SUPPORT_ACCT = "EMAIL_SUPPORT_ACCT"
    EMAIL_VOLUNTEER_ACCT = "EMAIL_VOLUNTEER_ACCT"

    @staticmethod
    def get_connection(email_acct):
        return getattr(settings, email_acct.value, None)


# Serializable wrapper for django.core.mail.EmailMessage
class EmailMessage:
    def __init__(self, **kwargs):
        self.to = kwargs.get("to")
        self.cc = kwargs.get("cc")
        self.bcc = kwargs.get("bcc")
        self.reply_to = kwargs.get("reply_to")
        self.subject = kwargs.get("subject")
        self.from_email = kwargs.get("from_email")
        self.body = kwargs.get("body")

    def send(self, email_acct: EmailAccount):
        from django.core.mail import EmailMessage as _EmailMessage

        email_msg = _EmailMessage()
        for key in [
            "to",
            "cc",
            "bcc",
            "reply_to",
            "subject",
            "from_email",
            "body",
            "content_subtype",
        ]:
            attr = getattr(self, key, None)
            if attr is not None:
                setattr(email_msg, key, attr)
        if settings.EMAIL_SUPPORT_ACCT and settings.EMAIL_VOLUNTEER_ACCT:
            email_msg.connection = (getattr(settings, email_acct.value))["connection"]
        email_msg.send()


def send_verification_email(contributor):
    # Get token
    user = Contributor.objects.get(id=contributor.id)
    verification_token = email_verify_token_generator.make_token(user)
    verification_url = (
        settings.PROTOCOL_DOMAIN
        + "/verify_user/"
        + str(contributor.id)
        + "/"
        + verification_token
    )
    # Send email with token
    email_template = (
        HtmlEmailTemplate()
        .header("Hi {{first_name}}, Welcome to DemocracyLab!")
        .paragraph("Please confirm your email address by clicking the button below.")
        .button(url=verification_url, text="Confirm Email Address")
    )
    email_msg = EmailMessage(
        subject="Welcome to DemocracyLab",
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[contributor.email],
    )
    email_msg = email_template.render(email_msg, {"first_name": user.first_name})
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_password_reset_email(contributor):
    # Get token
    user = Contributor.objects.get(id=contributor.id)
    reset_parameters = {
        "userId": contributor.id,
        "token": default_token_generator.make_token(user),
    }
    reset_url = section_url(FrontEndSection.ChangePassword, reset_parameters)
    # Send email with token
    email_template = (
        HtmlEmailTemplate()
        .header("Hi {{first_name}}.")
        .paragraph("Please click below to reset your password.")
        .button(url=reset_url, text="Reset Password")
    )
    email_msg = EmailMessage(
        subject="DemocracyLab Password Reset",
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[contributor.email],
    )
    email_msg = email_template.render(email_msg, {"first_name": user.first_name})
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_project_creation_notification(project):
    project_url = section_url(FrontEndSection.AboutProject, {"id": str(project.id)})

    verification_url = (
        settings.PROTOCOL_DOMAIN + "/api/projects/approve/" + str(project.id) + "/"
    )
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            '{first_name} {last_name}({email}) has created the project "{project_name}": \n {project_url}'.format(
                first_name=project.project_creator.first_name,
                last_name=project.project_creator.last_name,
                email=project.project_creator.email,
                project_name=project.project_name,
                project_url=project_url,
            )
        )
        .button(url=verification_url, text="Approve")
    )
    email_msg = EmailMessage(
        subject="New DemocracyLab Project: " + project.project_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[settings.ADMIN_EMAIL],
    )
    email_msg = email_template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_event_creation_notification(event):
    event_url = section_url(FrontEndSection.AboutEvent, {"id": str(event.id)})

    verification_url = (
        settings.PROTOCOL_DOMAIN + "/api/events/approve/" + str(event.id) + "/"
    )
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            '{first_name} {last_name}({email}) has created the event "{event_name}": \n {event_url}'.format(
                first_name=event.event_creator.first_name,
                last_name=event.event_creator.last_name,
                email=event.event_creator.email,
                event_name=event.event_name,
                event_url=event_url,
            )
        )
        .button(url=verification_url, text="Approve")
    )
    email_msg = EmailMessage(
        subject="New DemocracyLab Event: " + event.event_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[settings.ADMIN_EMAIL],
    )
    email_msg = email_template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_to_project_owners(project, sender, subject, template, include_co_owners=True):
    project_volunteers = VolunteerRelation.objects.filter(project=project.id)
    co_owner_emails = []
    if include_co_owners:
        co_owner_emails = list(
            map(
                lambda co: co.volunteer.email,
                list(filter(lambda v: v.is_co_owner, project_volunteers)),
            )
        )
    email_msg = EmailMessage(
        subject=subject,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[project.project_creator.email] + co_owner_emails,
        reply_to=[sender.email],
    )
    email_msg = template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def send_to_group_owners(group, sender, subject, template):
    email_msg = EmailMessage(
        subject=subject,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[group.group_creator.email],
        reply_to=[sender.email],
    )
    email_msg = template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def send_to_project_volunteer(volunteer_relation, subject, template, cc_owners=True):
    project_volunteers = VolunteerRelation.objects.filter(
        project=volunteer_relation.project.id
    )
    cc = []
    co_owner_emails = (
        list(
            map(
                lambda co: co.volunteer.email,
                list(filter(lambda v: v.is_co_owner, project_volunteers)),
            )
        )
        or []
    )
    cc = co_owner_emails + [volunteer_relation.project.project_creator.email]
    email_args = {
        "subject": subject,
        "from_email": _get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        "to": [volunteer_relation.volunteer.email],
        "reply_to": [volunteer_relation.project.project_creator.email]
        + co_owner_emails,
    }
    if cc_owners:
        email_args["cc"] = cc
    else:
        email_args["bcc"] = cc
    email_msg = EmailMessage(**email_args)
    email_msg = template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def send_to_event_project_volunteer(project, volunteer_rsvp, subject, template):
    email_msg = EmailMessage(
        subject=subject,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer_rsvp.volunteer.email],
        reply_to=[project.project_creator.email],
    )
    email_msg = template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def send_volunteer_application_email(volunteer_relation, is_reminder=False):
    project = volunteer_relation.project
    user = volunteer_relation.volunteer
    role_details = Tag.from_field(volunteer_relation.role)
    role_text = "{subcategory}: {name}".format(
        subcategory=role_details.subcategory, name=role_details.display_name
    )
    project_profile_url = section_url(
        FrontEndSection.AboutProject, {"id": str(project.id)}
    )
    approve_url = (
        settings.PROTOCOL_DOMAIN
        + "/volunteer/approve/"
        + str(volunteer_relation.id)
        + "/"
    )
    email_subject = "{is_reminder}{firstname} {lastname} would like to volunteer with {project} as {role}".format(
        is_reminder="Reminder: " if is_reminder else "",
        firstname=user.first_name,
        lastname=user.last_name,
        project=project.project_name,
        role=role_text,
    )
    email_template = (
        HtmlEmailTemplate()
        .subheader("Opportunity Information:")
        .text_line("Title: {role}".format(role=role_details.display_name))
        .text_line(
            "Organization: {projectname}".format(projectname=project.project_name)
        )
        .text_line(
            "Date: {currentdate}".format(
                currentdate=datetime_to_string(
                    timezone.now(), DateTimeFormats.MONTH_DD_YYYY
                )
            )
        )
        .subheader("Volunteer Information:")
        .text_line(
            "Name: {firstname} {lastname}".format(
                firstname=user.first_name, lastname=user.last_name
            )
        )
        .text_line("Email: " + Html.a(href="mailto:" + user.email, text=user.email))
    )
    if user.postal_code:
        email_template = email_template.text_line(
            "Zip: {zip}".format(zip=user.postal_code)
        )
    email_template = (
        email_template.header_left("You Have a New Volunteer!")
        .paragraph(
            '"{message}" -{firstname} {lastname}'.format(
                message=volunteer_relation.application_text,
                firstname=user.first_name,
                lastname=user.last_name,
            )
        )
        .paragraph(
            "To contact this volunteer directly, you can reply to this email. To review their profile or approve their application, use the buttons below."
        )
        .button(url=project_profile_url, text="Review Applicant on Project Page")
        .button(url=approve_url, text="Approve Volunteer")
    )
    send_to_project_owners(
        project=project, sender=user, subject=email_subject, template=email_template
    )


volunteer_conclude_email_template = (
    HtmlEmailTemplate()
    .header("How has your experience been at {{project_name}}?")
    .paragraph("Hi {{first_name}},")
    .paragraph(
        "We're always looking to improve the volunteer experience at DemocracyLab."
    )
    .paragraph(
        "Could you take this super-short survey to help us learn more about your time with {{project_name}}?"
    )
    .button(url=settings.VOLUNTEER_CONCLUDE_SURVEY_URL, text="Begin Survey")
)


def send_volunteer_conclude_email(volunteer, project_name):
    context = {
        "first_name": volunteer.first_name,
        "project_name": project_name,
    }
    email_msg = EmailMessage(
        subject="Tell us about your experience with " + project_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer.email],
    )
    email_msg = volunteer_conclude_email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


notify_volunteer_renewed_email_no_comment = HtmlEmailTemplate().paragraph(
    "{{volunteer_name}} has renewed their volunteer commitment with {{project_name}} until {{projected_end_date}}."
)

notify_volunteer_renewed_email_with_comments = (
    HtmlEmailTemplate()
    .paragraph(
        "{{volunteer_name}} has renewed their volunteer commitment with {{project_name}} until {{projected_end_date}}, "
        "and would like to convey the following:"
    )
    .paragraph('"{{comments}}"')
)


def notify_project_owners_volunteer_renewed_email(volunteer_relation, comments):
    email_template = (
        notify_volunteer_renewed_email_with_comments
        if comments
        else notify_volunteer_renewed_email_no_comment
    )
    project_name = volunteer_relation.project.project_name
    projected_end_date = datetime_to_string(
        datetime_field_to_datetime(volunteer_relation.projected_end_date),
        DateTimeFormats.DATE_LOCALIZED,
    )

    volunteer_name = volunteer_relation.volunteer.full_name()
    context = {
        "volunteer_name": volunteer_name,
        "project_name": project_name,
        "projected_end_date": projected_end_date,
        "comments": comments,
    }
    email_msg = EmailMessage(
        subject=volunteer_name
        + " has renewed their volunteer commitment with "
        + project_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=_get_co_owner_emails(volunteer_relation.project),
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


notify_volunteer_concluded_email_no_comment = HtmlEmailTemplate().paragraph(
    "{{volunteer_name}} has concluded their volunteer commitment with {{project_name}}."
)

notify_volunteer_concluded_email_with_comments = (
    HtmlEmailTemplate()
    .paragraph(
        "{{volunteer_name}} has concluded their volunteer commitment with {{project_name}}, "
        "and would like to convey the following:"
    )
    .paragraph('"{{comments}}"')
)


def notify_project_owners_volunteer_concluded_email(volunteer_relation, comments=None):
    email_template = (
        notify_volunteer_concluded_email_with_comments
        if comments
        else notify_volunteer_concluded_email_no_comment
    )
    project_name = volunteer_relation.project.project_name

    volunteer_name = volunteer_relation.volunteer.full_name()
    context = {
        "volunteer_name": volunteer_name,
        "project_name": project_name,
        "comments": comments,
    }
    email_msg = EmailMessage(
        subject=volunteer_name
        + " has concluded their volunteer commitment with "
        + project_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=_get_co_owner_emails(volunteer_relation.project),
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def notify_project_owners_project_approved(project):
    project_url = section_url(FrontEndSection.AboutProject, {"id": str(project.id)})
    email_template = (
        HtmlEmailTemplate()
        .header("Project Published!")
        .text_line("Hi {{first_name}},")
        .text_line(
            'Great news!  Your project "{{project_name}}" has been published on DemocracyLab.'
        )
        .button(url=project_url, text="View My Project")
    )
    context = {
        "first_name": project.project_creator.first_name,
        "project_name": project.project_name,
    }
    email_msg = EmailMessage(
        subject=project.project_name + " has been approved",
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=_get_co_owner_emails(project),
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def notify_project_owners_event_rsvp(event_project: EventProject):
    email_template = (
        HtmlEmailTemplate()
        .header("Thanks for signing up for {{event_name}}")
        .text_line(
            "Hi {{first_name}}, you’re leading a project for {{project_name}} at {{event_name}}"
        )
        .text_line(
            datetime_to_string(
                event_project.event.event_date_start,
                DateTimeFormats.SCHEDULED_DATE_TIME,
            )
        )
        .button(url=event_project.get_url(), text="Join Event")
        .text_line("Let’s build something great together.")
    )
    context = {
        "first_name": event_project.project.project_creator.first_name,
        "project_name": event_project.project.project_name,
        "event_name": event_project.event.event_name,
    }
    email_msg = EmailMessage(
        subject="Confirmed: RSVP for " + event_project.event.event_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=_get_co_owner_emails(event_project.project),
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def notify_event_owners_event_approved(event):
    email_template = HtmlEmailTemplate().paragraph(
        'Your event "{{event_name}}" has been approved. You can see it at {{event_url}}'
    )
    context = {
        "event_name": event.event_name,
        "event_url": section_url(FrontEndSection.AboutEvent, {"id": str(event.id)}),
    }
    email_msg = EmailMessage(
        subject=event.event_name + " has been approved",
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[event.event_creator.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_group_creation_notification(group):
    group_url = section_url(FrontEndSection.AboutGroup, {"id": str(group.id)})

    verification_url = (
        settings.PROTOCOL_DOMAIN + "/api/groups/approve/" + str(group.id) + "/"
    )
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            '{first_name} {last_name}({email}) has created the group "{group_name}": \n {group_url}'.format(
                first_name=group.group_creator.first_name,
                last_name=group.group_creator.last_name,
                email=group.group_creator.email,
                group_name=group.group_name,
                group_url=group_url,
            )
        )
        .button(url=verification_url, text="Approve")
    )
    email_msg = EmailMessage(
        subject="New DemocracyLab Group: " + group.group_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[settings.ADMIN_EMAIL],
    )
    email_msg = email_template.render(email_msg)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def notify_group_owners_group_approved(group):
    group_url = section_url(FrontEndSection.AboutGroup, {"id": str(group.id)})
    email_template = (
        HtmlEmailTemplate()
        .header('Congratulations! "{{group_name}}" has been approved.')
        .paragraph('Your group "{{group_name}}" has been approved.')
        .button(url=group_url, text="Go to Group Profile Page")
    )
    context = {
        "group_name": group.group_name,
    }
    email_msg = EmailMessage(
        subject=group.group_name + " has been approved",
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[group.group_creator.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_SUPPORT_ACCT)


def send_group_project_invitation_email(project_relation):
    # TODO: Send message to individual group owners by name
    project = project_relation.relationship_project
    group = project_relation.relationship_group
    project_url = section_url(FrontEndSection.AboutProject, {"id": str(project.id)})
    group_url = section_url(FrontEndSection.AboutGroup, {"id": str(group.id)})
    invite_header = project.project_name + " has been invited to connect!"
    email_template = (
        HtmlEmailTemplate()
        .header(invite_header)
        .paragraph(
            "{group_link} has invited you to collaborate and connect".format(
                group_link=Html.a(href=group_url, text=group.group_name)
            )
        )
        .paragraph('"{message}"'.format(message=project_relation.introduction_text))
        .button(url=project_url, text="View Your Groups")
    )
    send_to_project_owners(
        project=project,
        sender=group.group_creator,
        subject=invite_header,
        template=email_template,
    )


def notify_rsvped_volunteer(event: Event, volunteer: Contributor):
    email_template = (
        HtmlEmailTemplate()
        .header("Hi {{first_name}}, thanks for signing up for {{event_name}}")
        .paragraph(
            datetime_to_string(
                event.event_date_start, DateTimeFormats.SCHEDULED_DATE_TIME
            )
        )
        .paragraph(
            "We're excited to build something great together.  Please join one of the participating "
            + "projects, or check the event page, for more projects closer to the hackathon.  "
            + "You can also select a project on the day of the hackathon."
        )
        .button(url=event.get_url(), text="Event Details")
    )
    context = {"first_name": volunteer.first_name, "event_name": event.event_name}
    email_msg = EmailMessage(
        subject="Confirmed: RSVP for " + event.event_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def notify_rsvp_cancellation(event: Event, volunteer: Contributor):
    events_url = section_url(FrontEndSection.FindEvents)
    email_template = (
        HtmlEmailTemplate()
        .paragraph("We're sorry you won't make it.")
        .paragraph(
            "You can re-join the event, or other DemocracyLab events at any time."
        )
        .button(url=events_url, text="Browse other events")
    )
    context = {}
    email_msg = EmailMessage(
        subject="You've canceled your RSVP for " + event.event_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[volunteer.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def notify_rsvp_for_project_owner(rsvp: RSVPVolunteerRelation):
    role = Tag.get_by_name(rsvp.role.first())
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            "Congratulations!  A volunteer ({{role}}) has signed up for your hackathon project.  "
            + "Your team is growing."
        )
        .button(url=rsvp.event_project.get_url(), text="View Team")
    )
    context = {
        "role": role.display_name,
    }
    email_msg = EmailMessage(
        subject="A volunteer has signed up for your hackathon project",
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[rsvp.event_project.project.project_creator.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def notify_rsvp_cancellation_for_project_owner(rsvp: RSVPVolunteerRelation):
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            "Unfortunately, a volunteer has left your hackathon project. "
            + "But there's still plenty of time for volunteers to sign up, even on the day of the hackathon."
        )
        .button(url=rsvp.event_project.get_url(), text="View Team")
    )
    context = {}
    email_msg = EmailMessage(
        subject="A volunteer has left your hackathon project",
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[rsvp.event_project.project.project_creator.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def notify_rsvp_cancellation_for_event_owner(event_project: EventProject):
    email_template = (
        HtmlEmailTemplate()
        .paragraph(
            "Unfortunately, {{project_name}} has left {{event_name}}.  "
            + "Don’t worry – there’s still plenty of time for other projects to join the event."
        )
        .button(url=event_project.event.get_url(), text="View event page")
    )
    context = {
        "project_name": event_project.project.project_name,
        "event_name": event_project.event.event_name,
    }
    email_msg = EmailMessage(
        subject="A project has left " + event_project.event.event_name,
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[event_project.event.event_creator.email],
    )
    email_msg = email_template.render(email_msg, context)
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)


def _send_email(email_msg, email_acct=None):
    _email_acct = email_acct or EmailAccount.EMAIL_SUPPORT_ACCT

    if not settings.FAKE_EMAILS:
        email_msg.connection = EmailAccount.get_connection(_email_acct)["connection"]
    else:
        test_email_subject = "TEST EMAIL: " + email_msg.subject
        test_email_body = "<!--\n Environment:{environment}\nTO: {to_line}\nREPLY-TO: {reply_to}\nCC: {cc}\nBCC: {bcc}\n-->\n{body}".format(
            environment=settings.PROTOCOL_DOMAIN,
            to_line=email_msg.to,
            reply_to=email_msg.reply_to,
            body=email_msg.body,
            cc=email_msg.cc,
            bcc=email_msg.bcc,
        )
        email_msg.subject = test_email_subject
        email_msg.body = test_email_body
        email_msg.to = [settings.ADMIN_EMAIL]
        email_msg.cc = []
        email_msg.bcc = []
        if settings.EMAIL_SUPPORT_ACCT:
            email_msg.connection = settings.EMAIL_SUPPORT_ACCT["connection"]
    email_msg.send(_email_acct)


def send_email(email_msg, email_acct=None):
    enqueue(_send_email, email_msg, email_acct)


def _get_co_owner_emails(project):
    return list(map(lambda co_owner: co_owner.email, project.all_owners()))


def _get_account_from_email(email_acct: EmailAccount):
    email_connection = EmailAccount.get_connection(email_acct)
    return (
        email_connection["from_name"]
        if email_connection is not None
        else "DemocracyLab"
    )


def contact_democracylab_email(
    first_name, last_name, email_address, body, company_name, interest_flags=None
):
    # TODO: Remove if we aren't going to use company in the future
    if company_name and len(company_name) > 0:
        subject = "{} {}({}) would like to contact DemocracyLab".format(
            first_name, last_name, company_name
        )
    else:
        subject = "{} {} would like to contact DemocracyLab".format(
            first_name, last_name
        )
    if interest_flags:
        interest_strings = list(
            map(lambda flag: flag.replace("interest_", ""), interest_flags)
        )
        interest_text = "Interests: " + ",".join(interest_strings)
        body = interest_text + "\n" + body
    email_msg = EmailMessage(
        subject=subject,
        body=body,
        from_email=_get_account_from_email(EmailAccount.EMAIL_SUPPORT_ACCT),
        to=[settings.CONTACT_EMAIL],
        reply_to=[email_address],
    )
    send_email(email_msg)


def notify_matched_user(userAlert: UserAlert, projects):
    email_template = (
        HtmlEmailTemplate()
        .header("Hi {{first_name}}")
        .paragraph(
            "We have found some matched project according to your alert.  Please choose one of the "
            + "projects."
        )
    )
    for project in projects:
        email_template.button(url=project.project_url, text=project.project_name)

    email_msg = EmailMessage(
        subject="Found matched projects ",
        from_email=_get_account_from_email(EmailAccount.EMAIL_VOLUNTEER_ACCT),
        to=[userAlert.email],
    )
    email_msg = email_template.render(email_msg, {"first_name": userAlert.email}) # userAlert didn't store first_name
    send_email(email_msg, EmailAccount.EMAIL_VOLUNTEER_ACCT)
