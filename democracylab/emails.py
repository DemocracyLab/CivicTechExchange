from django.conf import settings
from django.core.mail import EmailMessage
from civictechprojects.models import Project


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
