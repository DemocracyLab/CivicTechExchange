import re
from django.conf import settings
from django.core.exceptions import SuspiciousOperation

# TRACE and TRACK have no legitimate use in a web application and are
# commonly used as cheap flood vectors (TRACE also enables Cross-Site Tracing).
_ALWAYS_BLOCKED_METHODS = frozenset({'TRACE', 'TRACK'})


class MaliciousRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        if settings.MALICIOUS_URL_PATTERNS is not None:
            url_patterns = settings.MALICIOUS_URL_PATTERNS.split(',')
            self.malicious_url_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), url_patterns))
        if settings.MALICIOUS_FWD_PATTERNS is not None:
            fwd_patterns = settings.MALICIOUS_FWD_PATTERNS.split(',')
            self.malicious_fwd_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), fwd_patterns))

    def check_request_method(self, request):
        if request.method in _ALWAYS_BLOCKED_METHODS:
            self.log_filter_action(f'Blocking disallowed HTTP method "{request.method}"')
            raise SuspiciousOperation("Disallowed HTTP method")

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
        self.check_request_method(request)
        hasattr(self, 'malicious_url_patterns') and self.check_request_url(request)
        hasattr(self, 'malicious_fwd_patterns') and self.check_request_fwd(request)

        return self.get_response(request)

