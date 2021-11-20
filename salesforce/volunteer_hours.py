from .client import SalesforceClient
import json
import requests
import threading

''' VolunteerRelation model maps to the Salesforce Volunteer Hours object '''
client = SalesforceClient.get_instance()
