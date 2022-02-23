from .client import SalesforceClient
import json
import requests
import threading
from common.models import Tag
from civictechprojects.models import ProjectPosition

''' ProjectPosition model maps to the Volunteer Job object in Salesforce '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(project_position: ProjectPosition):
    position_role = Tag.tags_field_descriptions(project_position.position_role)
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
            url=f'{client.job_endpoint}/platform_id__c/{project_position.id}',
            data=json.dumps(data)
        )
        thread = threading.Thread(target=run, args=(req,))
        thread.daemon = True
        thread.start()

