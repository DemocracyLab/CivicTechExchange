import json
import os
import re
from django.urls import re_path
from civictechprojects import views


def url_generator_from_pattern(pattern):
    # Scrub regex characters
    _pattern = pattern.replace('^', '').replace('$', '')
    # Replace id capturing group with string placeholder
    return re.sub("\\(.+\\)", "{id}", _pattern)


def generate_url_patterns(spec_path, set_url_generators=False):
    # Read json file
    base_dir = os.path.dirname(__file__)
    filename = os.path.join(base_dir, spec_path)
    url_patterns = []
    with open(filename, 'r', encoding='utf-8') as f:
        urls_json = json.load(f)
        for url_spec_json in urls_json:
            url_patterns.append(re_path(url_spec_json['pattern'], views.index))
            if set_url_generators:
                url_generators[url_spec_json['name']] = {
                    'section': url_spec_json['name'],
                    'regex': re.compile(url_spec_json['pattern']),
                    'generator': url_generator_from_pattern(url_spec_json['pattern'])
                }
    return url_patterns

url_generators = {}
v1_urls = generate_url_patterns('./components/urls/urls_v1.json')
v2_urls = generate_url_patterns('./components/urls/urls_v2.json', set_url_generators=True)
