from urllib import parse as urlparse
from common.helpers.dictionaries import merge_dicts


class ResourceNotFound(Exception):
    """Raised when a remote resource can't be found

    Attributes:
        url -- Url of resource request that failed
    """

    def __init__(self, url):
        self.url = url


def url_params(request):
    from common.helpers.front_end import get_page_path_parameters
    path_args = get_page_path_parameters(request.path)
    url_args = request.GET.urlencode()
    return merge_dicts(path_args, urlparse.parse_qs(url_args, keep_blank_values=0, strict_parsing=0))


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
