from urllib import parse as urlparse


def url_params(request):
    url_parts = request.GET.urlencode()
    return urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)