import json
import os
import requests
import threading
import democracylab.models
from democracylab import settings
from django.contrib.auth.models import User


class Client:
    __instance = None
    __session = None

    @staticmethod
    def getInstance():
        """ Static access method """
        if Client.__instance is None:
            return Client().__instance

    def __init__(self):
        """ Virtually private constructor """
        if Client.__instance is not None:
            self.initialize_session()
            self.getInstance()
        else:
            Client.__instance = self
            Client.__client = self.Client()


    def initialize_session(self):
        __session = requests.Session()
        endpoint = f'{settings.SALESFORCE_ENDPOINT}/services/data/v{settings.SALESFORCE_API_VERSION}'
        redirect_uri = settings.SALESFORCE_REDIRECT_URI
        client_id = settings.SALESFORCE_CLIENT_ID
        token_endpoint = f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}'
        bearer_token = f'Bearer {settings.SALESFORCE_ACCESS_TOKEN}'
        owner_id = settings.SALESFORCE_OWNER_ID
        contact_endpoint = f'{endpoint}/sobjects/contact'
        campaign_endpoint = f'{endpoint}/sobjects/campaign'
        job_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_job__c'
        hours_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_hours__c'
        self.__session.headers = {'Content-Type': 'application/json', 'Authorization': bearer_token}

    def send(self, prepped_request):
        response = self.__session.send(prepped_request)

    def authorize(self):
        r = requests.post(
            f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}',
            data={
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion': settings.SALESFORCE_JWT
            },
            headers={'content-type': 'application/x-www-form-urlencoded'}
        )
        os.environ['SALESFORCE_ACCESS_TOKEN'] = r.json()['access_token']

    def upsert_user(self, contributor: object):
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
        req = requests.Request(
            method="POST",
            url=self.contact_endpoint,
            data=json.dumps(data),
        )

        thread = threading.Thread(target=self.run, request=req)
        thread.daemon = True
        thread.start()

    def run(self, request):
        self.__client.send(request)
