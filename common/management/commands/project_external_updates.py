from django.core.management.base import BaseCommand
from common.helpers.github import fetch_github_repository_info

class Command(BaseCommand):
    def handle(self, *args, **options):
        project_github_links = get_project_github_links()
        for github_link in project_github_links:
            handle_project_github_updates(github_link)


def get_project_github_links():
    # Retrieve all of the ProjectLink objects that are for Github Links
    pass


def handle_project_github_updates(github_link):
    # Get last updated time
    repo = fetch_github_repository_info(github_link.link_url)
    # If time more recent than project current updated time, update project's update time
    pass



