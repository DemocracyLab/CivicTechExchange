import re
import time
from django.conf import settings
from django.http import HttpResponseBadRequest

# TRACE and TRACK have no legitimate use in a web application and are
# commonly used as cheap flood vectors (TRACE also enables Cross-Site Tracing).
_ALWAYS_BLOCKED_METHODS = frozenset({'TRACE', 'TRACK'})

# Caps repeated log lines for the same block reason during a flood, where
# per-request logging itself becomes a source of latency/CPU load.
_LOG_THROTTLE_SECONDS = 30


class MaliciousRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self._log_throttle_state = {}
        if settings.MALICIOUS_URL_PATTERNS is not None:
            url_patterns = settings.MALICIOUS_URL_PATTERNS.split(',')
            self.malicious_url_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), url_patterns))
        if settings.MALICIOUS_FWD_PATTERNS is not None:
            fwd_patterns = settings.MALICIOUS_FWD_PATTERNS.split(',')
            self.malicious_fwd_patterns = list(map(lambda pattern: re.compile(pattern, re.IGNORECASE), fwd_patterns))

    def check_request_method(self, request):
        if request.method in _ALWAYS_BLOCKED_METHODS:
            self.log_filter_action(f'Blocking disallowed HTTP method "{request.method}"', key=f'method:{request.method}')
            return HttpResponseBadRequest("Disallowed HTTP method")

    def check_request_url(self, request):
        path = request.get_full_path()
        for pattern in self.malicious_url_patterns:
            if pattern.search(path) is not None:
                self.log_filter_action(f'Filtering malicious url "{path}" matching pattern "{pattern.pattern}"', key=f'url:{pattern.pattern}')
                return HttpResponseBadRequest("Malicious url detected")

    def check_request_fwd(self, request):
        fwd = request.headers['X-Forwarded-For'] if 'X-Forwarded-For' in request.headers else request.META['REMOTE_ADDR']
        for pattern in self.malicious_fwd_patterns:
            if pattern.search(fwd) is not None:
                self.log_filter_action(f'Filtering malicious fwd "{fwd}" matching pattern "{pattern.pattern}"', key=f'fwd:{pattern.pattern}')
                return HttpResponseBadRequest("Malicious fwd detected")

    def log_filter_action(self, log_msg, key):
        now = time.monotonic()
        last_logged, suppressed = self._log_throttle_state.get(key, (None, 0))
        if last_logged is not None and now - last_logged < _LOG_THROTTLE_SECONDS:
            self._log_throttle_state[key] = (last_logged, suppressed + 1)
            return
        if suppressed:
            print(f'[MaliciousRequestsMiddleware] {log_msg} (+{suppressed} more suppressed in last {_LOG_THROTTLE_SECONDS}s)')
        else:
            print(f'[MaliciousRequestsMiddleware] {log_msg}')
        self._log_throttle_state[key] = (now, 0)

    def __call__(self, request):
        response = self.check_request_method(request)
        if response is not None:
            return response

        if hasattr(self, 'malicious_url_patterns'):
            response = self.check_request_url(request)
            if response is not None:
                return response

        if hasattr(self, 'malicious_fwd_patterns'):
            response = self.check_request_fwd(request)
            if response is not None:
                return response

        return self.get_response(request)

