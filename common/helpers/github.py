from common.helpers.date_helpers import DateTimeFormats, datetime_to_string
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
            print('Unable to read ' + github_url + ': ' + repo_info['message'])
            return None
        else:
            return repo_info
    except:
        print('Invalid json: ' + github_url)
        return None


def get_repo_endpoint_from_owner_repo_name(owner_repo_name, start_date=None, branch=None):
    if len(owner_repo_name) > 1:
        url_base = '{github}/repos/{owner}/{repo}/commits'.format(github=github_api_endpoint,
                                                                  owner=owner_repo_name[0],
                                                                  repo=owner_repo_name[1])
        params = {}
        if branch is not None:
            params['sha'] = branch
        if start_date is not None:
            params['since'] = datetime_to_string(start_date, DateTimeFormats.UTC_DATETIME)
        if params:
            url_base += '?' + urlparse.urlencode(params)
        return url_base


def get_owner_repo_name_from_public_url(public_repo_url):
    # Strip whitespace and trailing slashes
    cleaned_url = public_repo_url.strip().rstrip('/')
    path_parts = urlparse.urlparse(cleaned_url)
    if hasattr(path_parts, 'path'):
        return path_parts.path.split('/')[1:3]


def get_branch_name_from_public_url(public_repo_url):
    cleaned_url = public_repo_url.strip().rstrip('/')
    path_parts = urlparse.urlparse(cleaned_url)
    if hasattr(path_parts, 'path'):
        pos = path_parts.path.find("/tree/")
        if pos != -1:
            return path_parts.path[pos+6:]


# If the provided repo name is a user or organization, query github to get all of their repos
def get_repo_names_from_owner_repo_name(owner_repo_name):
    if len(owner_repo_name) > 1:
        return [owner_repo_name]
    else:
        response = get_repos_for_org(owner_repo_name[0])
        if response is not None:
            return response
        else:
            return get_repos_for_user(owner_repo_name[0])


def get_repos_for_org(owner_name):
    print('Retrieving repo endpoints for organization: ' + owner_name)
    repos_url = '{github}/orgs/{owner}/repos'.format(github=github_api_endpoint, owner=owner_name)
    repos_json = fetch_github_info(repos_url)
    if repos_json is None:
        print('No results found, querying users')
        return None
    else:
        repo_names = list(map(lambda repo_json: [owner_name, repo_json['name']], repos_json))
        return repo_names


def get_repos_for_user(owner_name):
    print('Retrieving repo endpoints for user: ' + owner_name)
    repos_url = '{github}/users/{owner}/repos'.format(github=github_api_endpoint, owner=owner_name)
    repos_json = fetch_github_info(repos_url)
    if repos_json is None:
        print('No user results found, giving up on github link')
        return None
    else:
        repo_names = list(map(lambda repo_json: [owner_name, repo_json['name']], repos_json))
        return repo_names
