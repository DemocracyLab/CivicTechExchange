from .client import SalesforceClient
import json
import requests
import threading
''' Contributor model maps to Salesforce Contact object '''
client = SalesforceClient()


def run(request):
    response = SalesforceClient().send(request)


def save(contributor: object):
    tags = list(contributor.user_technologies.all().values())
    data = {
        "ownerid": client.owner_id,
        "firstname": contributor.first_name,
        "lastname": contributor.last_name,
        "email": contributor.username,
        "phone": contributor.phone_primary,
        "mailingpostalcode": contributor.postal_code,
        "mailingcountry": contributor.country,
        "npo02__membershipjoindate__c": contributor.date_joined.strftime('%Y-%m-%d'),
        "description": contributor.about_me,
        "technologies__c": ",".join([tag.get('name') for tag in tags])
    }
    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}/platform_id__c/{contributor.id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def delete(contributor: object):
    req = requests.Request(
        method="DELETE",
        url=f'{client.contact_endpoint}/platform_id__c/{contributor.id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()
