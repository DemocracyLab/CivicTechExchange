from client import SalesforceClient
import json
import requests
import threading

client = SalesforceClient.get_instance()


def upsert_contact(contributor: object):
    data = {
        "ownerid": client.owner_id,
        "platform_id__c": contributor.pk,
        "firstname": contributor.first_name,
        "lastname": contributor.last_name,
        "email": contributor.username,
        "phone": contributor.phone_primary,
        "mailingpostalcode": contributor.postal_code,
        "mailingcountry": contributor.country,
        "technologies__c": contributor.user_technologies,
        "npo02__membershipjoindate__c": contributor.date_joined,
        "description": contributor.about_me
    }
    req = requests.Request(
        method="POST",
        url=client.contact_endpoint,
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, request=req)
    thread.daemon = True
    thread.start()


def run(request):
    client.send(request)
