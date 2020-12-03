import re
from django.conf import settings
from html import unescape


def section_url(section, args_dict=None):
    return settings.PROTOCOL_DOMAIN + section_path(section, args_dict)


def section_path(section, args_dict=None):
    if args_dict is None:
        args_dict = {}
    section_string = section.value if hasattr(section, 'value') else section
    arg_string = "".join(map(lambda kv: '&' + kv[0] + '=' + str(kv[1]), args_dict.items()))
    url = '/index/?section=' + section_string + arg_string
    return url


def get_page_section(url):
    match = re.search('section=(\w+)', url)
    if match is not None:
        groups = match.groups()
        return groups[0]


def get_clean_url(url):
    clean_url = unescape(url)
    return clean_url
