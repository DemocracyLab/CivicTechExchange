from urllib import parse as urlparse


class ResourceNotFound(Exception):
    """Raised when we attempt to download a thumbnail, and fail to download a usable image

    Attributes:
        not_thumbnail -- ProjectFile object representing the final file that was downloaded
    """


    def __init__(self, url):
        self.url = url


def url_params(request):
    url_parts = request.GET.urlencode()
    return urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)