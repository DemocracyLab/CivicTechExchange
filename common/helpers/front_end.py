import re
from django.conf import settings


def section_url(section, args_dict):
    arg_string = "".join(map(lambda kv: '&' + kv[0] + '=' + str(kv[1]), args_dict.items()))
    url = settings.PROTOCOL_DOMAIN + '/index/?section=' + section.value + arg_string
    return url


def get_page_section(url):
    match = re.search('section=(\w+)', url)
    if match is not None:
        groups = match.groups()
        return groups[0]
