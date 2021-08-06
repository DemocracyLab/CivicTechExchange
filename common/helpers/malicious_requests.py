import re
from django.conf import settings
from django.core.exceptions import MiddlewareNotUsed, SuspiciousOperation


class MaliciousRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.
        used = False
        if settings.MALICIOUS_URL_PATTERNS is not None:
            url_patterns = settings.MALICIOUS_URL_PATTERNS.split(',')
            self.malicious_url_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), url_patterns))
            used = True
        if settings.MALICIOUS_FWD_PATTERNS is not None:
            fwd_patterns = settings.MALICIOUS_FWD_PATTERNS.split(',')
            self.malicious_fwd_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), fwd_patterns))
            used = True

        if not used:
            raise MiddlewareNotUsed

    def check_request_url(self, request):
        path = request.get_full_path()
        for pattern in self.malicious_url_patterns:
            if pattern.search(path) is not None:
                self.log_filter_action(f'Filtering malicious url "{path}" matching pattern "{pattern.pattern}"')
                raise SuspiciousOperation("Malicious url detected")

    def check_request_fwd(self, request):
        fwd = request.headers['X-Forwarded-For'] if 'X-Forwarded-For' in request.headers else request.META['REMOTE_ADDR']
        for pattern in self.malicious_fwd_patterns:
            if pattern.search(fwd) is not None:
                self.log_filter_action(f'Filtering malicious fwd "{fwd}" matching pattern "{pattern.pattern}"')
                raise SuspiciousOperation("Malicious fwd detected")

    @staticmethod
    def log_filter_action(log_msg):
        print(f'[MaliciousRequestsMiddleware] {log_msg}')

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        hasattr(self, 'malicious_url_patterns') and self.check_request_url(request)
        hasattr(self, 'malicious_fwd_patterns') and self.check_request_fwd(request)

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

