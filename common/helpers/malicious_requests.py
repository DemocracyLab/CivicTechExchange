import re
from django.conf import settings
from django.core.exceptions import MiddlewareNotUsed
from django.http import HttpResponseBadRequest


class MaliciousRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.
        if settings.MALICIOUS_URL_PATTERNS is not None:
            patterns = settings.MALICIOUS_URL_PATTERNS.split(',')
            self.malicious_url_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), patterns))
        else:
            raise MiddlewareNotUsed

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        path = request.get_full_path()
        for pattern in self.malicious_url_patterns:
            if pattern.search(path) is not None:
                # TODO: Log
                return HttpResponseBadRequest

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
