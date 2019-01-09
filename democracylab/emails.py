from django.conf import settings
from django.core.mail import EmailMessage
from civictechprojects.models import Project, VolunteerRelation


def send_project_creation_notification(project):
    project_url = settings.PROTOCOL_DOMAIN + '/index/?section=AboutProject&id=' + str(project.id)
    email_msg = EmailMessage(
        'New DemocracyLab Project: ' + project.project_name,
        '{first_name} {last_name}({email}) has created the project "{project_name}": \n {project_url}'.format(
            first_name=project.project_creator.first_name,
            last_name=project.project_creator.last_name,
            email=project.project_creator.email,
            project_name=project.project_name,
            project_url=project_url
        ),
        settings.DEFAULT_FROM_EMAIL,
        [settings.ADMIN_EMAIL]
    )
    send_email(email_msg)


def send_to_project_owners(project, sender, subject, body):
    project_volunteers = VolunteerRelation.objects.filter(project=project.id)
    co_owner_emails = list(map(lambda co: co.volunteer.email, list(filter(lambda v: v.is_co_owner, project_volunteers))))
    email_msg = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,
        to=[project.project_creator.email] + co_owner_emails,
        reply_to=[sender.email]
    )
    send_email(email_msg)


def send_to_project_volunteer(volunteer_relation, subject, body):
    project_volunteers = VolunteerRelation.objects.filter(project=volunteer_relation.project.id)
    co_owner_emails = list(map(lambda co: co.volunteer.email, list(filter(lambda v: v.is_co_owner, project_volunteers))))
    email_msg = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,
        to=[volunteer_relation.volunteer.email],
        reply_to=[volunteer_relation.project.project_creator.email] + co_owner_emails,
    )
    send_email(email_msg)


def send_email(email_msg):
    if not settings.FAKE_EMAILS:
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
            from_email=settings.EMAIL_HOST_USER,
            to=[settings.ADMIN_EMAIL]
        )
        test_email_msg.send()
