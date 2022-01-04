from django.core.management.base import BaseCommand
from civictechprojects.models import Project, VolunteerRelation, TaggedVolunteerRole
from democracylab.models import Contributor
from salesforce import contact as salesforce_contact, campaign as salesforce_campaign
import traceback


class Command(BaseCommand):
    def handle(self, *args, **options):
        contributors = Contributor.objects.filter(is_active__exact=True)
        for contributor in contributors:
            try:
                salesforce_contact.save(contributor)
            except Exception:
                print(f'Error merging user in Salesforce: ({contributor.id}) {contributor.username}')
                print(traceback.format_exc())

        projects = Project.objects.filter(is_searchable__exact=True)
        for project in projects:
            try:
                salesforce_campaign.save(project)
            except Exception:
                print(f'Error merging project in Salesforce: ({project.id}) {project.project_name}')
                print(traceback.format_exc())

