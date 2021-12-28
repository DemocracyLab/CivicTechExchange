from .client import SalesforceClient
import json
import requests
import threading

''' ProjectPosition model maps to the Volunteer Job object in Salesforce '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(project_position: object):
    """
        POST to the composite endpoint
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
                    "GW_Volunteers__Campaign__c": "@{MyCampaign.Id}",
                    "name": "Front-End Developer",
                    "gw_volunteers__description__c": "Volunteer position"
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
