from .client import SalesforceClient
import json
import requests
import threading

''' VolunteerRelation model maps to the Volunteer Hours object in Salesforce '''
client = SalesforceClient.get_instance()
