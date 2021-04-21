import re
from django.conf import settings
from html import unescape
from .constants import deprecated_page_redirects
from common.helpers.dictionaries import keys_omit


def args_dict_to_string(args_dict):
    def arg_string(idx, key, value):
        prefix = '?' if idx == 0 else '&'
        return '{prefix}{key}={value}'.format(prefix=prefix, key=key, value=value)
    return "".join(map(lambda ikv: arg_string(idx=ikv[0], key=ikv[1][0], value=ikv[1][1]), enumerate(args_dict.items())))


def section_url(section, args_dict=None):
    return settings.PROTOCOL_DOMAIN + section_path(section, args_dict)


def section_path(section, args_dict=None):
    from common.urls import url_generators
    if args_dict is None:
        args_dict = {}
    section_string = section.value if hasattr(section, 'value') else section
    id_arg = {'id': ''}
    if args_dict and 'id' in args_dict:
        id_arg = {'id': args_dict['id']}
        args_dict = keys_omit(args_dict, ['id'])
    section_path_url = '/' + url_generators[section_string]['generator'].format(**id_arg)
    section_path_url += args_dict_to_string(args_dict)
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
    return match.groupdict()


def get_clean_url(url):
    clean_url = unescape(url)
    return clean_url


def redirect_from_deprecated_url(section_name):
    if section_name in deprecated_page_redirects:
        return section_url(deprecated_page_redirects[section_name])
