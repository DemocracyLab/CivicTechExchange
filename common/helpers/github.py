from common.helpers.date_helpers import DateTimeFormats, datetime_field_to_datetime, datetime_to_string
from django.conf import settings
from urllib import parse as urlparse
import requests


def fetch_github_repository_info(repo_url):
    headers = {"Authorization":"token " + settings.GITHUB_API_TOKEN} if settings.GITHUB_API_TOKEN is not None else {}
    response = requests.get(repo_url, headers=headers)
    try:
        repo_info = response.json()
        if 'message' in repo_info:
            print('Error reading ' + repo_url + ': ' + repo_info['message'])
            return None
        else:
            return repo_info
    except:
        print('Invalid json: ' + repo_url)
        return None


def get_repo_endpoint_from_owner_repo_name(owner_repo_name, start_date=None):
    # TODO: Add support for getting all repos under Org/User, like https://github.com/DemocracyLab
    if len(owner_repo_name) > 1:
        url_base = 'https://api.github.com/repos/{owner}/{repo}/commits'.format(owner=owner_repo_name[0], repo=owner_repo_name[1])
        if start_date is not None:
            return url_base + '?since=' + datetime_to_string(start_date, DateTimeFormats.UTC_DATETIME)
        else:
            return url_base


def get_owner_repo_name_from_public_url(public_repo_url):
    path_parts = urlparse.urlparse(public_repo_url)
    if hasattr(path_parts, 'path'):
        return path_parts.path.split('/')[1:3]


def get_latest_commit_date(repo_info):
    if len(repo_info) > 0:
        first_commit = repo_info[0]
        if 'commit' in first_commit:
            return first_commit['commit']['author']['date']

