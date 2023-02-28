from common.models import Tag
from common.helpers.date_helpers import DateTimeFormats
from .client import SalesforceClient
import json
import requests
import threading
''' 

Contributor model maps to the Contact object in Salesforce 
*** Created only in the verify_user method; Only save if email_verified ***

'''
client = SalesforceClient()


def run(request):
    SalesforceClient().send(request)


def save(contributor: object):
    data = {
        "ownerid": client.owner_id,
        "email": contributor.username
    }
    # Take care not to overwrite with blanks. User may already exist in salesforce, from a different source
    if contributor.first_name:
        data['firstname'] = contributor.first_name
    if contributor.last_name:
        data['lastname'] = contributor.last_name
    if contributor.phone_primary:
        data['phone'] = contributor.phone_primary
    if contributor.postal_code:
        data['mailingpostalcode'] = contributor.postal_code
    if contributor.country:
        data['mailingcountry'] = contributor.country
    if contributor.date_joined:
        data['npo02__membershipjoindate__c'] = contributor.date_joined.strftime(DateTimeFormats.SALESFORCE_DATE.value)
    if contributor.about_me:
        data['description'] = contributor.about_me
    if contributor.user_technologies:
        data['technologies__c'] = Tag.tags_field_descriptions(contributor.user_technologies)

    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}/platform_id__c/{contributor.id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def set_category(user_id, category):
    data = {"category__c": category}
    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}/platform_id__c/{user_id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def set_title(user_id, title):
    data = {"title": title}
    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}/platform_id__c/{user_id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def set_dlab_volunteer_role(user_id, role):
    data = {"DL_Volunteer_role__c": role}
    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}/platform_id__c/{user_id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def delete(user_id):
    req = requests.Request(
        method="DELETE",
        url=f'{client.contact_endpoint}/platform_id__c/{user_id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()