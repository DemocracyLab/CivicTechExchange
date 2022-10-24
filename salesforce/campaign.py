from civictechprojects.models import Project, ProjectPosition
from common.helpers.date_helpers import DateTimeFormats
from common.models import Tag
from .client import SalesforceClient
from common.helpers.queue import enqueue
from salesforce import volunteer_job
import json
import requests
import threading

''' 

Project model maps to the Campaign object in Salesforce 
*** Created only in the approve_project method; Only save if is_searchable ***

'''
client = SalesforceClient()


def run(request):
    SalesforceClient().send(request)


def create(project: Project):
    if project.is_searchable:
        project.project_date_created = project.project_date_created or project.project_date_modified
        save(project, creating_new=True)  # syncronous call must complete before pushing positions to Salesforce
        positions = ProjectPosition.objects.filter(position_project_id__exact=project.id)
        for position in positions:
            volunteer_job.save(position)


def save(project: Project, creating_new=False):
    if project.is_searchable:
        if creating_new:
            _save(project)
        else:
            enqueue(_save, project)


def _save(project: Project):
    status = 'In Progress' if project.is_searchable else 'Completed'
    data = {
        "ownerid": client.owner_id,
        "Project_Owner__r":
            {
                "platform_id__c": project.project_creator.id
            },
        "recordtypeid": "01246000000uOeRAAU",
        "name": project.project_name,
        "isactive": project.is_searchable,
        "status": status,
        "project_url__c": project.project_url,
        "description_action__c": project.project_description_actions,
        "description_solution__c": project.project_description_solution,
        "short_description__c": project.project_short_description,
        "description": project.project_description,
        "issue_area__c": Tag.tags_field_descriptions(project.project_issue_area),
        "stage__c": Tag.tags_field_descriptions(project.project_stage),
        "type": Tag.tags_field_descriptions(project.project_organization_type),
        "technologies__c": Tag.tags_field_descriptions(project.project_technologies),
        "startdate": project.project_date_created.strftime(
            DateTimeFormats.SALESFORCE_DATE.value)
    }
    '''synchronous call (campaign must be saved before saving jobs)'''
    SalesforceClient().send(requests.Request(
        method="PATCH",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}',
        data=json.dumps(data)
    ))


def delete(project: object):
    req = requests.Request(
        method="DELETE",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()
