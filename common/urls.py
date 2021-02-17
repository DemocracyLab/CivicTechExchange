import os
import json
from django.urls import re_path
from civictechprojects import views


def generate_url_patterns(spec_path):
    # Read json file
    base_dir = os.path.dirname(__file__)
    filename = os.path.join(base_dir, spec_path)
    url_patterns = []
    with open(filename, 'r', encoding='utf-8') as f:
        urls_json = json.load(f)
        for url_spec_json in urls_json:
            url_patterns.append(re_path(url_spec_json['pattern'], views.index))

    # Generate url objects
    return url_patterns


v1_urls = generate_url_patterns('./components/urls/urls_v1.json')
v2_urls = generate_url_patterns('./components/urls/urls_v2.json')