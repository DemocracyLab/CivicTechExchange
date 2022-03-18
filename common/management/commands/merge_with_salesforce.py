from django.core.management.base import BaseCommand
from civictechprojects.models import Project, VolunteerRelation, ProjectPosition
from democracylab.models import Contributor
from salesforce import contact as salesforce_contact, campaign as salesforce_campaign, volunteer_job, volunteer_hours
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

        projects = Project.objects.filter(is_searchable__exact=True).filter(is_created__exact=True).filter(deleted__exact=False)
        for project in projects:
            try:
                salesforce_campaign.save(project)
            except Exception:
                print(f'Error merging project in Salesforce: ({project.id}) {project.project_name}')
                print(traceback.format_exc())

        for volunteer in VolunteerRelation.objects.filter(is_approved__exact=True).order_by('volunteer_id').distinct('volunteer_id'):
            try:
                salesforce_contact.set_title(volunteer.volunteer_id, 'Project Volunteer')
                volunteer.save_to_salesforce()
            except Exception:
                print(f'Error merging volunteer (user {volunteer.volunteer_id}) in Salesforce')
                print(traceback.format_exc())

        # Include historical, non-searchable projects:
        projects = Project.objects.raw(f'select * from civictechprojects_project where is_created and not deleted and not is_searchable and lower(project_name) not like "%test%" and id not in (90,155,156,169,170,229,279,352,427,510,648,653,660,778,784,832,878,893,902,903)')
        for project in projects:
            try:
                salesforce_campaign.save(project)
            except Exception:
                print(f'Error merging project in Salesforce: ({project.project.id}) {project.project_name}')
                print(traceback.format_exc())

        # project_positions - Salesforce will return errors where it finds no corresponding campaign
        for position in ProjectPosition.objects.all():
            try:
                volunteer_job.save(position)
            except Exception:
                print(f'Error merging project_position in Salesforce for project {position.position_project.project_name}')
                print(traceback.format_exc())


        # Set labels for project volunteers:
        for volunteer in VolunteerRelation.objects.filter(is_approved__exact=True).order_by('volunteer_id').distinct('volunteer_id'):
            try:
                salesforce_contact.set_title(volunteer.volunteer_id, 'Project Volunteer')
            except Exception:
                print(f'Error setting title for user {volunteer.volunteer_id} in Salesforce ("Project Volunteer")')
                print(traceback.format_exc())

        for project in Project.objects.filter(is_created__exact=True).order_by('project_creator_id').distinct('project_creator_id'):
            try:
                salesforce_contact.set_title(project.project_creator_id, 'Project Owner')
            except Exception:
                print(f'Error setting title for user {project.project_creator_id} in Salesforce ("Project Owner")')
                print(traceback.format_exc())

