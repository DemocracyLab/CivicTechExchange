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
    email_msg.send()


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
    email_msg.send()


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
    email_msg.send()