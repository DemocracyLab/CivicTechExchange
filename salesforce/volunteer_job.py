import json
import requests
import threading
from .client import SalesforceClient
from common.helpers.queue import enqueue
from common.models import Tag

''' ProjectPosition model maps to the Volunteer Job object in Salesforce '''
client = SalesforceClient()


def run(request):
    SalesforceClient().send(request)


def _save(project_position):
    position_role = Tag.tags_field_descriptions(project_position.position_role)
    platform_id__c = f'{project_position.position_project.id}{position_role.lower().replace(" ", "")}'
    # Skip if the role tag is blank
    if position_role != '':
        data = {
            "GW_Volunteers__Campaign__r":
                {
                    "platform_id__c": project_position.position_project.id
                },
            "name": position_role,
            "gw_volunteers__description__c": project_position.position_description
        }
        req = requests.Request(
            method="PATCH",
            url=f'{client.job_endpoint}/platform_id__c/{platform_id__c}',
            data=json.dumps(data)
        )
        ''' Changed this to a synchronous call to avoid record locks (duplicate position names are possible) '''
        SalesforceClient().send(req)

        #thread = threading.Thread(target=run, args=(req,))
        #thread.daemon = True
        #thread.start()


def save(project_position):
    if project_position.position_project.is_searchable:
        enqueue(_save, project_position)


def delete(project_position):
    position_role = Tag.tags_field_descriptions(project_position.position_role)
    platform_id__c = f'{project_position.position_project.id}{position_role.lower().replace(" ", "")}'
    data = {"GW_Volunteers__Inactive__c": True}
    req = requests.Request(
        method="PATCH",
        url=f'{client.job_endpoint}/platform_id__c/{platform_id__c}',
        data=json.dumps(data)
    )
    SalesforceClient().send(req)
