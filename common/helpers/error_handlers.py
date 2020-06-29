import sys
from django.shortcuts import redirect
from common.helpers.constants import FrontEndSection
from common.helpers.dictionaries import merge_dicts
from common.helpers.front_end import section_url


class ReportableError(Exception):
    """Exception raised that needs to be logged and sent to a front end error page

    Attributes:
        message -- explanation of the error to be reported in the logs
        front_end_args -- arguments to be surfaced on the front end error page
    """

    def __init__(self, message, front_end_args):
        self.message = message
        self.front_end_args = front_end_args or {}


def handle500(request):
    exception_type, exception, traceback = sys.exc_info()
    if isinstance(exception, ReportableError):
        # Log message
        print("Error(500): " + exception.message)
        error_args = merge_dicts(exception.front_end_args, {'errorType': type(exception).__name__})
        # Redirect to Error page
        return redirect(section_url(FrontEndSection.Error, error_args))
    else:
        return redirect(section_url(FrontEndSection.Error))

