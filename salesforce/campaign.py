import datetime
from civictechprojects.models import Project, ProjectPosition
from . import volunteer_job
from common.models import Tag
from .client import SalesforceClient
import json
import requests
import threading
''' Project model maps to the Campaign object in Salesforce '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(project: Project, update_postions = False):
    data = {
        "ownerid": client.owner_id,
        "Project_Owner__r":
            {
                "platform_id__c": project.project_creator.id
            },
        "recordtypeid": "01246000000uOeRAAU",
        "name": project.project_name,
        "isactive": project.is_searchable,
        "project_url__c": project.project_url,
        "description_action__c": project.project_description_actions,
        "description_solution__c": project.project_description_solution,
        "short_description__c": project.project_short_description,
        "description": project.project_description,
        "issue_area__c": Tag.tags_field_descriptions(project.project_issue_area),
        "stage__c": Tag.tags_field_descriptions(project.project_stage),
        "type": Tag.tags_field_descriptions(project.project_organization_type),
        "technologies__c": Tag.tags_field_descriptions(project.project_technologies)
    }

    data['startdate'] = project.project_date_created.strftime('%Y-%m-%d') if project.project_date_created else datetime.date.strftime('%Y-%m-%d')

    req = requests.Request(
        method="PATCH",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}',
        data=json.dumps(data)
    )
    campaign_thread = threading.Thread(target=run, args=(req,))
    campaign_thread.daemon = True
    campaign_thread.start()

    if update_postions:
        campaign_thread.join()
        for position in ProjectPosition.objects.filter(position_project=project.id):
            volunteer_job.save(position)


def delete(project: object):
    req = requests.Request(
        method="DELETE",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()
