from client import SalesforceClient
import json
import requests
import threading

""" Corresponds to the VolunteerRelation model """

client = SalesforceClient.get_instance()
