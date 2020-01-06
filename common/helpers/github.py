from common.helpers.date_helpers import DateTimeFormats, datetime_field_to_datetime, datetime_to_string
from django.conf import settings
from urllib import parse as urlparse
import requests


github_api_endpoint='https://api.github.com'


def fetch_github_info(github_url):
    headers = {"Authorization":"token " + settings.GITHUB_API_TOKEN} if settings.GITHUB_API_TOKEN is not None else {}
    response = requests.get(github_url, headers=headers)
    try:
        repo_info = response.json()
        if 'message' in repo_info:
            print('Error reading ' + github_url + ': ' + repo_info['message'])
            return None
        else:
            return repo_info
    except:
        print('Invalid json: ' + github_url)
        return None


def get_repo_endpoint_from_owner_repo_name(owner_repo_name, start_date=None):
    if len(owner_repo_name) > 1:
        url_base = '{github}/repos/{owner}/{repo}/commits'.format(github=github_api_endpoint,
                                                                  owner=owner_repo_name[0],
                                                                  repo=owner_repo_name[1])
        if start_date is not None:
            return url_base + '?since=' + datetime_to_string(start_date, DateTimeFormats.UTC_DATETIME)
        else:
            return url_base


def get_owner_repo_name_from_public_url(public_repo_url):
    # Strip whitespace and trailing slashes
    cleaned_url = public_repo_url.strip().rstrip('/')
    path_parts = urlparse.urlparse(cleaned_url)
    if hasattr(path_parts, 'path'):
        return path_parts.path.split('/')[1:3]


# If the provided repo name is a user or organization, query github to get all of their repos
def get_repo_names_from_owner_repo_name(owner_repo_name):
    if len(owner_repo_name) > 1:
        return [owner_repo_name]
    else:
        return get_repos_for_owner(owner_repo_name[0])


def get_repos_for_owner(owner_name):
    print('Retrieving repo endpoints for user/organization: ' + owner_name)
    repos_url = '{github}/orgs/{owner}/repos'.format(github=github_api_endpoint, owner=owner_name)
    repos_json = fetch_github_info(repos_url)
    repo_names = list(map(lambda repo_json: [owner_name, repo_json['name']], repos_json))
    return repo_names
