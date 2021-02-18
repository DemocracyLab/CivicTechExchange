import re
from django.conf import settings
from html import unescape
from common.helpers.dictionaries import keys_omit


def section_url(section, args_dict=None):
    return settings.PROTOCOL_DOMAIN + section_path(section, args_dict)


def section_path(section, args_dict=None):
    from common.urls import url_generators
    if args_dict is None:
        args_dict = {}
    section_string = section.value if hasattr(section, 'value') else section
    id_arg = {}
    if args_dict and 'id' in args_dict:
        id_arg = {'id': args_dict['id']}
        args_dict = keys_omit(args_dict, ['id'])
    section_path_url = '/' + url_generators[section_string]['generator'].format(**id_arg)
    section_path_url += "".join(map(lambda kv: '&' + kv[0] + '=' + str(kv[1]), args_dict.items()))
    return section_path_url


def get_page_section_generator(url):
    from common.urls import url_generators
    for key in url_generators:
        url_generator = url_generators[key]
        regex = url_generator['regex']
        match = regex.match(url)
        if match is not None:
            return url_generator


def get_page_section(url):
    url_generator = get_page_section_generator(url)
    return url_generator and url_generator['section']


def get_page_path_parameters(url, page_section_generator=None):
    page_section_generator = page_section_generator or get_page_section_generator(url)
    match = page_section_generator['regex'].search(url)
    return match.groupsdict()


def get_clean_url(url):
    clean_url = unescape(url)
    return clean_url
