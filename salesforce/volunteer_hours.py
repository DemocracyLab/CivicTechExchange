from datetime import datetime
from .client import SalesforceClient
import json
import requests
import threading

'''
 VolunteerRelation model maps to the Volunteer Hours object in Salesforce 
 Created in Salesforce when a volunteer is approved via the web site
'''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)
    print(response.status_code,  response.text)


def send_volunteer_data(volunteer_id, data):
    req = requests.Request(
        method="PATCH",
        url=f'{client.hours_endpoint}/platform_id__c/{volunteer_id}',
        data=json.dumps(data)
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def create(volunteer, position_id):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": position_id
        },
        "GW_Volunteers__Status__c": "Confirmed",
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime("%Y-%m-%d"),
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date.strftime("%Y-%m-%d")
    }
    send_volunteer_data(volunteer.id, data)


def renew(volunteer, position_id):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": position_id
        },
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date.strftime("%Y-%m-%d")
    }
    send_volunteer_data(volunteer.id, data)


def conclude(volunteer, position_id):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": position_id
        },
        "GW_Volunteers__Status__c": "Completed"
    }
    send_volunteer_data(volunteer.id, data)


def dismiss(volunteer, position_id):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": position_id
        },
        "GW_Volunteers__Status__c": "Canceled"
    }
    send_volunteer_data(volunteer.id, data)
