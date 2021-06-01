from .client import SalesforceClient
import json
import requests
import threading

client = SalesforceClient()


def save(contributor: object):
    from common.models import Tag
    technologies = Tag.hydrate_to_json(contributor.pk, list(contributor.user_technologies.all().values()))
    data = {
        "firstname": contributor.first_name,
        "lastname": contributor.last_name,
        "email": contributor.username,
        "phone": contributor.phone_primary,
        "mailingpostalcode": contributor.postal_code,
        "mailingcountry": contributor.country,
        "npo02__membershipjoindate__c": contributor.date_joined.strftime('%Y-%m-%d'),
        "description": contributor.about_me
    }
    req = requests.Request(
        method="PATCH",
        url=f'{client.contact_endpoint}{contributor.id}',
        data=json.dumps(data),
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def run(request):
    response = SalesforceClient().send(request)
