from django.http import HttpResponseBadRequest


class MaliciousRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        path = request.get_full_path()
        # TODO: Put in separate module
        # TODO: Read from regex environment variable
        if 'escaped_fragment' in path:
            return HttpResponseBadRequest

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
