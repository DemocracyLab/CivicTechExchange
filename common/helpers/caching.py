from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url
from django_seo_js import settings
from django_seo_js.helpers import update_cache_for_url
from django_seo_js.backends import SEOBackendBase, SelectedBackend
from django_seo_js.backends.base import RequestsBasedBackend

import re
from django_seo_js.helpers import request_should_be_ignored
from pprint import pprint
import logging
logger = logging.getLogger(__name__)


def update_cached_project_url(project_id):
    update_cached_url(section_url(FrontEndSection.AboutProject, {'id': project_id}))


# Update url cached with our 3rd party prerender service
def update_cached_url(url):
    print('caching ' + url)
    update_cache_for_url(url)


class DebugUserAgentMiddleware(SelectedBackend):
    def __init__(self, *args, **kwargs):
        super(DebugUserAgentMiddleware, self).__init__(*args, **kwargs)
        regex_str = "|".join(settings.USER_AGENTS)
        regex_str = ".*?(%s)" % regex_str
        self.USER_AGENT_REGEX = re.compile(regex_str, re.IGNORECASE)

    def process_request(self, request):
        if not settings.ENABLED:
            print('DebugUserAgentMiddleware: settings.ENABLED False')
            return

        if request_should_be_ignored(request):
            print('DebugUserAgentMiddleware: request_should_be_ignored')
            return

        if "HTTP_USER_AGENT" not in request.META:
            print('DebugUserAgentMiddleware: HTTP_USER_AGENT not in request.META')
            return

        if not self.USER_AGENT_REGEX.match(request.META["HTTP_USER_AGENT"]):
            print('DebugUserAgentMiddleware: User agent "{agent}" not in list'.format(agent=request.META["HTTP_USER_AGENT"]))
            return

        url = self.backend.build_absolute_uri(request)
        print('DebugUserAgentMiddleware: Getting response for ' + url)
        try:
            return self.backend.get_response_for_url(url)
        except Exception as e:
            logger.exception(e)


class DebugPrerenderIO(SEOBackendBase, RequestsBasedBackend):
    """Implements the backend for prerender.io"""
    BASE_URL = "https://service.prerender.io/"
    RECACHE_URL = "https://api.prerender.io/recache"

    def __init__(self, *args, **kwargs):
        print('DebugPrerenderIO __init__')
        super(SEOBackendBase, self).__init__(*args, **kwargs)
        self.token = self._get_token()

    def _get_token(self):
        if settings.PRERENDER_TOKEN is None:
            raise ValueError("Missing SEO_JS_PRERENDER_TOKEN in settings.")
        return settings.PRERENDER_TOKEN

    def get_response_for_url(self, url):
        """
        Accepts a fully-qualified url.
        Returns an HttpResponse, passing through all headers and the status code.
        """
        if not url or "//" not in url:
            raise ValueError("Missing or invalid url: %s" % url)

        render_url = self.BASE_URL + url
        headers = {
            'X-Prerender-Token': self.token,
        }

        print('DebugPrerenderIO get_response_for_url from ' + render_url)
        r = self.session.get(render_url, headers=headers, allow_redirects=False)
        assert r.status_code < 500

        return self.build_django_response_from_requests_response(r)

    def update_url(self, url=None, regex=None):
        """
        Accepts a fully-qualified url, or regex.
        Returns True if successful, False if not successful.
        """
        print('DebugPrerenderIO update_url')
        print(settings.PRERENDER_TOKEN)
        if not url and not regex:
            raise ValueError("Neither a url or regex was provided to update_url.")

        headers = {
            'X-Prerender-Token': self.token,
            'Content-Type': 'application/json',
        }
        data = {
            'prerenderToken': settings.PRERENDER_TOKEN,
        }
        if url:
            data["url"] = url
        if regex:
            data["regex"] = regex

        print(self.RECACHE_URL)
        pprint(headers)
        pprint(data)

        r = self.session.post(self.RECACHE_URL, headers=headers, data=data)
        print(r.status_code)
        # print(r.reason_phrase)
        pprint(r.content)
        return r.status_code < 500