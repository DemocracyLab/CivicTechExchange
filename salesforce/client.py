import requests
from democracylab import settings
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


class SalesforceClient:
    __session = None
    bearer_token = ''
    endpoint = f'{settings.SALESFORCE_ENDPOINT}/services/data/v{settings.SALESFORCE_API_VERSION}'
    token_endpoint = f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}'
    contact_endpoint = f'{endpoint}/sobjects/contact'
    campaign_endpoint = f'{endpoint}/sobjects/campaign'
    job_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_job__c'
    hours_endpoint = f'{endpoint}/sobjects/gw_volunteers__volunteer_hours__c'
    composite_endpoint = f'{endpoint}/composite'
    owner_id = settings.SALESFORCE_OWNER_ID

    def __init__(self):
        self.initialize_session()

    """ Session provides Authorization header for all requests """
    """ Default timeout to avoid hung threads """
    def initialize_session(self):
        self.__session = requests.Session()
        self.__session.headers = {'Content-Type': 'application/json', 'Authorization': SalesforceClient.bearer_token}
        adapter = TimeoutHTTPAdapter(max_retries=retry_strategy)
        self.__session.mount("https://", adapter)
        self.__session.mount("http://", adapter)

    def send(self, req):
        if settings.SALESFORCE_JWT:
            prepped_request = self.__session.prepare_request(req)
            response = self.__session.send(prepped_request)
            if response.status_code == requests.codes.unauthorized:
                auth = self.authorize()
                if auth.status_code == requests.codes.ok:
                    prepped_request.headers['Authorization'] = SalesforceClient.bearer_token
                    response = self.__session.send(prepped_request)

            print(f'Salesforce returned {response.status_code}: {response.text}')
            return response
        else:
            return requests.codes.ok

    def authorize(self):
        res = requests.post(
            f'{settings.SALESFORCE_LOGIN_URL}{settings.SALESFORCE_TOKEN_SUFFIX}',
            data={
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion': settings.SALESFORCE_JWT
            },
            headers={'content-type': 'application/x-www-form-urlencoded'}
        )
        if res.status_code == requests.codes.ok:
            SalesforceClient.bearer_token = f"Bearer {res.json()['access_token']}"
        return res


DEFAULT_TIMEOUT = 30.1  # seconds
retry_strategy = Retry(
    total=2,
    status_forcelist=[429, 500, 502, 503, 504],
    method_whitelist=["HEAD", "PATCH", "POST", "GET", "OPTIONS"]
)


class TimeoutHTTPAdapter(HTTPAdapter):
    def __init__(self, *args, **kwargs):
        self.timeout = DEFAULT_TIMEOUT
        if "timeout" in kwargs:
            self.timeout = kwargs["timeout"]
            del kwargs["timeout"]
        super().__init__(*args, **kwargs)

    def send(self, request, **kwargs):
        timeout = kwargs.get("timeout")
        if timeout is None:
            kwargs["timeout"] = self.timeout
        return super().send(request, **kwargs)
