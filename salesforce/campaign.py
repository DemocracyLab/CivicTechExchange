from common.models import Tag
from .client import SalesforceClient
import json
import requests
import threading
''' Project model maps to the Salesforce Campaign object '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)
    print(f'{response.status_code}: {response.text}')


def save(project: object):
    stage_tags = list(project.project_stage.all().values())
    org_type_tags = list(project.project_organization_type.all().values())
    tech_tags = list(project.project_technologies.all().values())
    issue_area_tags = list(project.project_issue_area.all().values())
    data = {
                "ownerid": client.owner_id,
                "Project_Owner__r":
                {
                    "platform_id__c": project.project_creator.id
                },
                "recordtypeid": "01246000000uOeRAAU",
                "name": project.project_name,
                "type": ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in org_type_tags]),
                "isactive": project.is_searchable,
                "startdate": project.project_date_created.strftime('%Y-%m-%d'),
                "issue_area__c": ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in issue_area_tags]),
                "technologies__c": ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in tech_tags]),
                "stage__c": ",".join([Tag.get_by_name(tag.get('name')).display_name for tag in stage_tags]),
                "project_url__c": project.project_url,
                "description_action__c": project.project_description_actions,
                "description_solution__c": project.project_description_solution,
                "short_description__c": project.project_short_description,
                "description": project.project_description
            }
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
