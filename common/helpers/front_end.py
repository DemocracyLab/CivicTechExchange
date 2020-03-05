import re
from django.conf import settings


def section_url(section, args_dict=None):
    if args_dict is None:
        args_dict = {}
    section_string = section.value if hasattr(section, 'value') else section
    arg_string = "".join(map(lambda kv: '&' + kv[0] + '=' + str(kv[1]), args_dict.items()))
    url = settings.PROTOCOL_DOMAIN + '/index/?section=' + section_string + arg_string
    return url


def get_page_section(url):
    match = re.search('section=(\w+)', url)
    if match is not None:
        groups = match.groups()
        return groups[0]
