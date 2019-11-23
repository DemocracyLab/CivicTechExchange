from django.conf import settings
from urllib import parse as urlparse
import requests


def fetch_github_repository_info(repo_url):
    headers = {"Authorization":"token " + settings.GITHUB_API_TOKEN} if settings.GITHUB_API_TOKEN is not None else {}
    response = requests.get(repo_url, headers=headers)
    try:
        return response.json()
    except:
        print('Invalid json: ' + repo_url)
        return None


def get_repo_endpoint_from_public_url(public_repo_url, start_date, end_date):
    # https://github.com/DemocracyLab/CivicTechExchange
    # TODO: Add support for getting all repos under Org/User, like https://github.com/DemocracyLab

    path_parts = urlparse.urlparse(public_repo_url)
    if hasattr(path_parts, 'path'):
        url_parts = path_parts.path.split('/')
        if len(url_parts) > 1:
            return 'https://api.github.com/repos/{owner}/{repo}/commits'.format(owner=url_parts[1], repo=url_parts[2])


def get_latest_commit_date(repo_info):
    return repo_info[0]["commit"]['author']['date']
