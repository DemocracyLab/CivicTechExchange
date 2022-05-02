import datetime
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
    status = 'Web Sign Up'
    if volunteer.projected_end_date.date() < datetime.date.today():
        status = 'Completed'
    else:
        if volunteer.re_enrolled_last_date is not None:
            status = 'Renewed'
        elif volunteer.approved_date is not None:
            status = 'Accepted'

    data = {
        "GW_Volunteers__Contact__r":
        {
            "platform_id__c": volunteer.volunteer_id
        },
        "GW_Volunteers__Volunteer_Job__r":
        {
            "platform_id__c": volunteer.salesforce_job_id()
        },
        "GW_Volunteers__Status__c": "Confirmed",
        "GW_Volunteers__Start_Date__c": (volunteer.approved_date or volunteer.application_date).strftime("%Y-%m-%d"),
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date.strftime("%Y-%m-%d")
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
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime("%Y-%m-%d"),
        "GW_Volunteers__End_Date__c": volunteer.projected_end_date.strftime("%Y-%m-%d")
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
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime("%Y-%m-%d"),
        "GW_Volunteers__Status__c": "Completed"
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
        "GW_Volunteers__Start_Date__c": volunteer.approved_date.strftime("%Y-%m-%d"),
        "GW_Volunteers__End_Date__c": datetime.date.today().strftime("%Y-%m-%d"),
        "GW_Volunteers__Status__c": "Canceled"
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


def import_hours():
    from civictechprojects.models import VolunteerRelation
    import traceback
    print('Importing volunteer relations ...')
    count = 0
    for volunteer in VolunteerRelation.objects.all():
        try:
            count = count + 1
            if count % 100 == 0: print(f'{count} volunteer relations')
            create(volunteer)
        except Exception:
            print(f'Error merging VolunteerRelation {volunteer.id} in Salesforce')
            print(traceback.format_exc())
    print(f'{count} volunteer relations')
