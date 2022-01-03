from common.models import Tag
from .client import SalesforceClient
import json
import requests
import threading
''' Project model maps to the Campaign object in Salesforce '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(project: object):
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
        "description": project.project_description
    }

    if project.project_date_created:
        data['startdate'] = project.project_date_created.strftime('%Y-%m-%d')

    issue_area_tags = list(project.project_issue_area.all().values())
    if issue_area_tags:
        data['issue_area__c'] = ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in issue_area_tags])
    stage_tags = list(project.project_stage.all().values())
    if stage_tags:
        data['stage__c'] = ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in stage_tags])
    org_type_tags = list(project.project_organization_type.all().values())
    if org_type_tags:
        data['type'] = ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in org_type_tags])
    tech_tags = list(project.project_technologies.all().values())
    if tech_tags:
        data['technologies__c'] = ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in tech_tags])
    req = requests.Request(
        method="PATCH",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}',
        data=json.dumps(data)
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def delete(project: object):
    req = requests.Request(
        method="DELETE",
        url=f'{client.campaign_endpoint}/platform_id__c/{project.id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()
