import json
import requests
import threading
import democracylab.models
from democracylab import settings
from django.contrib.auth.models import User


class Salesforce:
    __instance = None
    __client = None

    @staticmethod
    def getInstance():
        """ Static access method """
        if Salesforce.__instance is None:
            Salesforce()
        return Salesforce.__instance

    def __init__(self):
        """ Virtually private constructor """
        if Salesforce.__instance is not None:
            self.getInstance()
        else:
            Salesforce.__instance = self
            Salesforce.__client = self.Client()




    class Client:
        session = requests.Session()

        def __init__(self):
            endpoint = f'{settings.SALESFORCE_ENDPOINT}/services/data/v{settings.SALESFORCE_API_VERSION}'
            redirect_uri = settings.SALESFORCE_REDIRECT_URI
            client_id = settings.SALESFORCE_CLIENT_ID
            token_endpoint = f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}'
            bearer_token = f'Bearer {settings.SALESFORCE_ACCESS_TOKEN}'
            jwt = settings.SALESFORCE_JWT
            owner_id = settings.SALESFORCE_OWNER_ID
            contact_endpoint = f'{endpoint}/sobjects/contact'
            self.session.headers = {'Content-Type': 'application/json', 'Authorization': bearer_token}

        def send(self, prepped_request):
            response = self.session.send(prepped_request)


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


