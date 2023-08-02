import re
from django.conf import settings
from html import unescape
from urllib import parse as urlparse
from .constants import deprecated_page_redirects, FrontEndSection
from common.helpers.dictionaries import keys_omit


def args_dict_to_query_string(args_dict, urlencode=False):
    '''
    Takes argument dictionary and converts into query string
    :param args_dict:   Dictionary of url arguments
    :param urlencode:   Whether to url encode the dictionary values
    :return:            Query string result
    '''
    def arg_string(idx, key, value):
        prefix = '?' if idx == 0 else '&'
        return '{prefix}{key}={value}'.format(prefix=prefix, key=key, value=urlparse.quote(value) if urlencode else value)
    return "".join(map(lambda ikv: arg_string(idx=ikv[0], key=ikv[1][0], value=ikv[1][1]), enumerate(args_dict.items())))


def section_url(section, args_dict=None):
    return settings.PROTOCOL_DOMAIN + section_path(section, args_dict)


def _section_path_special_cases(section_string, args_dict=None):
    # TODO: Fix the url template generators to handle these
    if section_string == FrontEndSection.CreateEventProject.value:
        return "/events/{event_id}/projects/create/{project_id}".format(event_id=args_dict['event_id'], project_id=args_dict['project_id'])
    elif section_string == FrontEndSection.AboutEventProject.value:
        return "/events/{event_id}/projects/{project_id}".format(event_id=args_dict['event_id'], project_id=args_dict['project_id'])


def section_path(section, args_dict=None):
    from common.urls import url_generators
    if args_dict is None:
        args_dict = {}
    section_string = section.value if hasattr(section, 'value') else section
    id_arg = {'id': ''}
    if args_dict and 'id' in args_dict:
        id_arg = {'id': args_dict['id']}
        args_dict = keys_omit(args_dict, ['id'])
    section_path_url = _section_path_special_cases(section_string, args_dict)
    if section_path_url:
        return section_path_url
    section_path_url = '/' + url_generators[section_string]['generator'].format(**id_arg)
    section_path_url += args_dict_to_query_string(args_dict)
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

def has_page_section(section_name):
    from common.urls import url_generators
    return section_name in url_generators

def get_page_path_parameters(url, page_section_generator=None):
    page_section_generator = page_section_generator or get_page_section_generator(url)
    match = page_section_generator['regex'].search(url)
    return match.groupdict()


def clean_invalid_args(url_args):
    """Filter out invalid query string arguments from old url system
        Extract args dictionary
        Remove id and section from dictionary
        Reconstruct url from dictionary using args_dict_to_string

    Args:
        url_args(str) : URL query string arguments
    
    Returns:
        str: clean URL query string arguments
    """
    # Sanity check
    if url_args == "":
        return url_args
    from urllib import parse as urlparse
    # The format of url_args_dict is {'a': ['1'], 'b': ['2']}
    url_args_dict = urlparse.parse_qs(url_args, keep_blank_values=0, strict_parsing=0)
    url_args_dict.pop('section', None)
    url_args_dict.pop('id', None)
    url_args_dict = {key: value[0] for key, value in url_args_dict.items()}
    return args_dict_to_query_string(url_args_dict, urlencode=True)


def get_clean_url(url):
    clean_url = unescape(url)
    return clean_url


def redirect_from_deprecated_url(section_name):
    # Redirect deprecated Press section
    if section_name == FrontEndSection.Press.value:
        return settings.BLOG_URL
    if section_name in deprecated_page_redirects:
        return section_url(deprecated_page_redirects[section_name])
