import os
import requests
from democracylab import settings


class SalesforceClient:
    __session = None
    endpoint = f'{settings.SALESFORCE_ENDPOINT}/services/data/v{settings.SALESFORCE_API_VERSION}'
    token_endpoint = f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}'
    contact_endpoint = f'{endpoint}/sobjects/contact'
    campaign_endpoint = f'{endpoint}/sobjects/campaign'
    job_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_job__c'
    hours_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_hours__c'
    redirect_uri = settings.SALESFORCE_REDIRECT_URI
    client_id = settings.SALESFORCE_CLIENT_ID
    owner_id = settings.SALESFORCE_OWNER_ID
    bearer_token = f'Bearer {settings.SALESFORCE_ACCESS_TOKEN}'

    def __init__(self):
        self.initialize_session()

    """ Session provides Authorization header for all requests """
    def initialize_session(self):
        self.__session = requests.Session()
        self.__session.headers = {'Content-Type': 'application/json', 'Authorization': self.bearer_token}

    def send(self, prepped_request):
        response = self.__session.send(prepped_request)
        print('ok')
        return response

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
