from client import SalesforceClient
import json
import requests
import threading

client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(project: object):
    tech_tags = list(project.project_technologies.all().values())
    issue_tags = list(project.issue_areas.all().values())
    data = {
                "ownerid": project.project_creator.id,
                "Project_Owner__r":
                {
                    "platform_id__c": project.project_creator.id
                },
                "recordtypeid": "01246000000uOeRAAU",
                "name": project.project_name,
                "platform_id__c": project.id,
                "type": "Informal (No Legal Entity Established)",
                "startdate": project.project_date_created,
                "stage__c": project.project_stage,
                "issue_area__c": ",".join([tag.get('name') for tag in issue_tags]),
                "technologies__c": ",".join([tag.get('name') for tag in tech_tags]),
                "project_url__c": project.project_url,
                "short_description__c": project.project_description,
                "description_action__c": project.project_description_action,
                "description_solution__c": project.project_description_solution,
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

