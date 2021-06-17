from client import SalesforceClient
import json
import requests
import threading

""" Corresponds to the ProjectPosition model """

client = SalesforceClient.get_instance()
