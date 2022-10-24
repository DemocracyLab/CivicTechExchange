import datetime
from .client import SalesforceClient
from common.helpers.date_helpers import DateTimeFormats
import json
import requests
import threading

'''
 VolunteerRelation model maps to the Volunteer Hours object in Salesforce 
 Created in Salesforce when a volunteer is approved via the web site
'''
client = SalesforceClient()


def run(request):
    SalesforceClient().send(request)


def send_volunteer_data(volunteer_id, data):
    req = requests.Request(
        method="PATCH",
        url=f'{client.hours_endpoint}/platform_id__c/{volunteer_id}',
        data=json.dumps(data)
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def create(volunteer):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Status__c": 'Application Received',
        "GW_Volunteers__Start_Date__c": volunteer.application_date.strftime(DateTimeFormats.SALESFORCE_DATE.value),
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date
    }
    send_volunteer_data(volunteer.id, data)


def accept(volunteer):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Status__c": 'Accepted',
        "GW_Volunteers__Start_Date__c": (volunteer.approved_date or volunteer.application_date).strftime(DateTimeFormats.SALESFORCE_DATE.value)
    }
    send_volunteer_data(volunteer.id, data)


def renew(volunteer):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Status__c": 'Renewed',
        "GW_Volunteers__Start_Date__c": (volunteer.approved_date or volunteer.application_date).strftime(DateTimeFormats.SALESFORCE_DATE.value),
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date
    }
    send_volunteer_data(volunteer.id, data)


def conclude(volunteer):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime(DateTimeFormats.SALESFORCE_DATE.value),
        "GW_Volunteers__Status__c": "Completed",
        "GW_Volunteers__Hours_Worked__c": 0
    }
    send_volunteer_data(volunteer.id, data)


def dismiss(volunteer):
    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime(DateTimeFormats.SALESFORCE_DATE.value),
        "GW_Volunteers__End_Date__c": datetime.date.today().strftime(DateTimeFormats.SALESFORCE_DATE.value),
        "GW_Volunteers__Status__c": "Rejected"
    }
    send_volunteer_data(volunteer.id, data)


def delete(hours_id):
    req = requests.Request(
        method="DELETE",
        url=f'{client.hours_endpoint}/platform_id__c/{hours_id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()
