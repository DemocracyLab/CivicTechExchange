import os
import sys
import logging

# Add the CivicTechExchange folder to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set DJANGO_DEBUG environment variable to False
os.environ['DJANGO_DEBUG'] = 'False'

# Set DJANGO_SETTINGS_MODULE environment variable
os.environ['DJANGO_SETTINGS_MODULE'] = 'democracylab.settings'

# Import Django settings
from django.conf import settings

# Import Django setup
import django

# Call Django setup
django.setup()

# Test exception logging
def divide_by_zero():
    return 1 / 0

try:
    divide_by_zero()
except ZeroDivisionError:
    logging.error("Divide by zero error", exc_info=True)
