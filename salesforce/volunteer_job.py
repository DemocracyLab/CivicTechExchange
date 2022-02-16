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


@staticmethod
def save(project_position: ProjectPosition):
    position_role = Tag.tags_field_descriptions(project_position.position_role)
    if position_role:
        """
            POST to the composite endpoint.
            Skip if the role tag is blank
        """
        data = {
            "allOrNone": "true",
            "compositeRequest": [
                {
                    "method": "GET",
                    "referenceId": "MyCampaign",
                    "url": f'{client.campaign_endpoint}/platform_id__c/{project_position.position_project.id}'
                },
                {
                    "method": "POST",
                    "referenceId": "ThisJob",
                    "url": client.job_endpoint,
                    "body": {
                        "platform_id__c": project_position.id,
                        "name": position_role,
                        "GW_Volunteers__Campaign__c": "@{MyCampaign.Id}",
                        "gw_volunteers__description__c": project_position.position_description
                    }
                }
            ]
        }

        req = requests.Request(
            method="POST",
            url=f'{client.endpoint}/composite',
            data=json.dumps(data)
        )
        thread = threading.Thread(target=run, args=(req,))
        thread.daemon = True
        thread.start()
