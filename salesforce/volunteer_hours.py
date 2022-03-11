from .client import SalesforceClient
import json
import requests
import threading

''' VolunteerRelation model maps to the Volunteer Hours object in Salesforce '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(volunteer, position_id):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": position_id
        },
        "GW_Volunteers__Status__c": "Accepted",
        "GW_Volunteers__Start_Date__c": volunteer.approved_date
    }

    req = requests.Request(
        method="PATCH",
        url=f'{client.hours_endpoint}/platform_id__c/{volunteer.id}',
        data=json.dumps(data)
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


