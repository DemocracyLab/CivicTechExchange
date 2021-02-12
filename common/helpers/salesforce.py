import json
import requests
import threading
import democracylab.models
from democracylab import settings
from django.contrib.auth.models import User


class Salesforce:

    endpoint = f'{settings.SALESFORCE_ENDPOINT}/services/data/v{settings.SALESFORCE_API_VERSION}'
    redirect_uri = settings.SALESFORCE_REDIRECT_URI
    client_id = settings.SALESFORCE_CLIENT_ID
    token_endpoint = f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}'
    bearer_token = f'Bearer {settings.SALESFORCE_ACCESS_TOKEN}'
    jwt = settings.SALESFORCE_JWT
    owner_id = settings.SALESFORCE_OWNER_ID
    headers = {'Authorization': bearer_token}
    contact_endpoint = f'{endpoint}/sobjects/contact'

    def upsert_user(self, contributor: User):
        data = {
            "ownerid": self.owner_id,
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
        r = requests.post(
            self.contact_endpoint,
            data=json.dumps(data),
            headers=self.headers
        )
        '''
        req = requests.Request(
            method="POST", 
            url=self.contact_endpoint, 
            headers=self.headers
        )
        thread = threading.Thread(target=self.run, args=(req))
        thread.daemon = True
        thread.start()
        '''
    def run(self):
        pass


