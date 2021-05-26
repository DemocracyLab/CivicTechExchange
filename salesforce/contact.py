from .client import SalesforceClient
import json
import requests
import threading

client = SalesforceClient()


def upsert(contributor: object):
    from common.models import Tag
    # technologies = Tag.hydrate_to_json(contributor.pk, list(contributor.user_technologies.all().values()))
    data = {
        "ownerid": client.owner_id,
        "platform_id__c": contributor.pk,
        "firstname": contributor.first_name,
        "lastname": contributor.last_name,
        "email": contributor.username,
        "phone": contributor.phone_primary,
        "mailingpostalcode": contributor.postal_code,
        "mailingcountry": contributor.country,
        "description": contributor.about_me,
        "technologies__c": Tag.hydrate_to_json(contributor.pk, list(contributor.user_technologies.all().values())),
        "npo02__membershipjoindate__c": contributor.date_joined.strftime('%m/%d/%Y %H:%M:%S'),
        "description": contributor.about_me
    }
    req = requests.Request(
        method="POST",
        url=client.contact_endpoint,
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def run(request):
    SalesforceClient().send(request)
