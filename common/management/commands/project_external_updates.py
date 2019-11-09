from django.core.management.base import BaseCommand
from common.helpers.github import fetch_github_repository_info, get_latest_commit_date, get_repo_endpoint_from_public_url


class Command(BaseCommand):
    def handle(self, *args, **options):
        project_github_links = get_project_github_links()
        for github_link in project_github_links:
            handle_project_github_updates(github_link)


def get_project_github_links():
    from civictechprojects.models import ProjectLink
    # TODO: Filter out non-github links
    return ProjectLink.objects.filter(link_name='link_coderepo')


def handle_project_github_updates(project_github_link):
    # Get last updated time
    print(project_github_link.link_url)
    repo_url = get_repo_endpoint_from_public_url(project_github_link.link_url)
    if repo_url is not None:
        repo_info = fetch_github_repository_info(repo_url)
        if repo_info is not None:
            print(repo_info)
            latest_commit_date = get_latest_commit_date(repo_info)
            print(latest_commit_date)
            # If time more recent than project current updated time, update project's update time




