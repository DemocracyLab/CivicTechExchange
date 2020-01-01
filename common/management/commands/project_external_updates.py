from django.core.management.base import BaseCommand
from common.helpers.github import fetch_github_info, get_latest_commit_date, get_owner_repo_name_from_public_url, \
    get_repo_endpoint_from_owner_repo_name, get_repo_names_from_owner_repo_name
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
    last_updated_time = datetime_field_to_datetime(get_project_latest_commit_date(project_github_link.link_project))
    owner_repo_name = get_owner_repo_name_from_public_url(project_github_link.link_url)

    repo_names = get_repo_names_from_owner_repo_name(owner_repo_name)
    for repo_name in repo_names:
        repo_url = get_repo_endpoint_from_owner_repo_name(repo_name, last_updated_time)
        print('Ingesting: ' + repo_url)
        repo_info = fetch_github_info(repo_url)
        repo_name = repo_name[0] + '/' + repo_name[1]
        if repo_info is not None and len(repo_info) > 0:
            project = project_github_link.link_project
            add_commits_to_database(project, repo_name, 'master', repo_info)
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


def add_commits_to_database(project, repo_name, branch_name, repo_info):
    from civictechprojects.models import ProjectCommit
    for commit_info in repo_info:
        ProjectCommit.create(project, repo_name, branch_name, commit_info)


def get_project_latest_commit_date(project):
    from civictechprojects.models import ProjectCommit
    latest_commit = ProjectCommit.objects.filter(commit_project=project.id).order_by('-commit_date').first()
    return latest_commit and latest_commit.commit_date
