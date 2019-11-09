from django.core.management.base import BaseCommand
from common.helpers.github import fetch_github_repository_info, get_latest_commit_date, get_repo_endpoint_from_public_url
from common.helpers.date_helpers import datetime_field_to_datetime
import pytz


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
    repo_url = get_repo_endpoint_from_public_url(project_github_link.link_url)
    if repo_url is not None:
        repo_info = fetch_github_repository_info(repo_url)
        if repo_info is not None:
            latest_commit_date = get_latest_commit_date(repo_info)
            update_if_commit_after_project_updated_time(project_github_link, latest_commit_date)


def update_if_commit_after_project_updated_time(project_github_link, latest_commit_date_string):
    project = project_github_link.link_project
    project_updated_time = datetime_field_to_datetime(project.project_date_modified)
    latest_commit_time = datetime_field_to_datetime(latest_commit_date_string)
    # Need to add timezone info to time from github
    latest_commit_time = pytz.timezone("UTC").localize(latest_commit_time)
    if project_updated_time < latest_commit_time:
        print('Updating project {id} to latest timestamp: {time}'.format(id=project.id, time=latest_commit_date_string))
        project.update_timestamp(latest_commit_time)
    else:
        print('Did not update project {id} because last commit at {commit_time} before project updated time {project_update}'.format(
            id=project.id,
            commit_time=latest_commit_date_string,
            project_update=project_updated_time))