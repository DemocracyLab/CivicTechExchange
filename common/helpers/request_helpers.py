from urllib import parse as urlparse


class ResourceNotFound(Exception):
    """Raised when a remote resource can't be found

    Attributes:
        url -- Url of resource request that failed
    """

    def __init__(self, url):
        self.url = url


def url_params(request):
    url_parts = request.GET.urlencode()
    return urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)