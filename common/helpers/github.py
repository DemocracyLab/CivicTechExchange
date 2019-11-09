from urllib import parse as urlparse
import requests


def fetch_github_repository_info(repo_url):
    # TODO: Use api key so we can get a usable rate limit
    response = requests.get(repo_url)
    try:
        return response.json()
    except:
        print('Invalid json: ' + repo_url)
        return None


def get_repo_endpoint_from_public_url(public_repo_url):
    # https://github.com/DemocracyLab/CivicTechExchange
    path_parts = urlparse.urlparse(public_repo_url)
    if hasattr(path_parts, 'path'):
        url_parts = path_parts.path.split('/')
        if len(url_parts) > 1:
            return 'https://api.github.com/repos/{owner}/{repo}/commits'.format(owner=url_parts[1], repo=url_parts[2])


def get_latest_commit_date(repo_info):
    return repo_info[0]["commit"]['author']['date']
