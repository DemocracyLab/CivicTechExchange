from django.core.management.base import BaseCommand
from common.helpers.db import bulk_delete
from common.helpers.github import fetch_github_info, get_owner_repo_name_from_public_url, \
    get_repo_endpoint_from_owner_repo_name, get_repo_names_from_owner_repo_name, get_branch_name_from_public_url
from common.helpers.date_helpers import datetime_field_to_datetime
from django.conf import settings
import pytz
import traceback


class Command(BaseCommand):
    def handle(self, *args, **options):
        project_github_links = get_project_github_links()
        for github_link in project_github_links:
            try:
                if github_link.link_project.is_searchable:
                    handle_project_github_updates(github_link)
            except:
                # Keep processing if we run into errors with a particular update
                print('Error processing Github Link: ' + github_link.link_url)
                print(traceback.format_exc())
                pass


def get_project_github_links():
    from civictechprojects.models import ProjectLink
    repo_links = ProjectLink.objects.filter(link_name='link_coderepo', link_url__icontains='github.com/')\
        .exclude(link_project__isnull=True)
    branch_links = ProjectLink.objects.filter(link_url__icontains='github.com/').filter(link_url__icontains='/tree/')\
        .exclude(link_name='link_coderepo', link_project__isnull=True)
    return repo_links.union(branch_links)


def handle_project_github_updates(project_github_link):
    project = project_github_link.link_project
    print('Handling updates for project {id} github link: {url}'.format(id=project.id, url=project_github_link.link_url))
    last_updated_time = datetime_field_to_datetime(get_project_latest_commit_date(project_github_link.link_project))
    owner_repo_name = get_owner_repo_name_from_public_url(project_github_link.link_url)
    branch_name = get_branch_name_from_public_url(project_github_link.link_url)
    repo_names = get_repo_names_from_owner_repo_name(owner_repo_name)
    raw_commits = []
    for repo_name in repo_names:
        repo_url = get_repo_endpoint_from_owner_repo_name(repo_name, last_updated_time, branch_name)
        print('Ingesting: ' + repo_url) 
        repo_info = fetch_github_info(repo_url)
        if repo_info is not None and len(repo_info) > 0:
            repo_display_name = repo_name[0] + '/' + repo_name[1]
            raw_commits = raw_commits + list(map(lambda commit: [repo_display_name, commit, branch_name], repo_info))

    if len(raw_commits) > 0:
        # Take the most recent top X commits
        raw_commits.sort(key=lambda commit: commit[1]['commit']['author']['date'], reverse=True)
        raw_commits = raw_commits[:settings.MAX_COMMITS_PER_PROJECT]
        add_commits_to_database(project, raw_commits)
        latest_commit_date = raw_commits[0][1]['commit']['author']['date']
        update_if_commit_after_project_updated_time(project, latest_commit_date)
        remove_old_commits(project)


def update_if_commit_after_project_updated_time(project, latest_commit_date_string):
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


def add_commits_to_database(project, commits_to_ingest):
    from civictechprojects.models import ProjectCommit
    for commit_info in commits_to_ingest:
        ProjectCommit.create(project, commit_info[0], commit_info[2], commit_info[1])
    project.recache()


def get_project_latest_commit_date(project):
    from civictechprojects.models import ProjectCommit
    latest_commit = ProjectCommit.objects.filter(commit_project=project.id).order_by('-commit_date').first()
    return latest_commit and latest_commit.commit_date


def remove_old_commits(project):
    from civictechprojects.models import ProjectCommit
    # Get the number of commits to delete
    commit_count = ProjectCommit.objects.filter(commit_project=project.id).count()
    # Delete them
    if commit_count > settings.MAX_COMMITS_PER_PROJECT:
        print('Deleting {ct} commits from project {id}'.format(ct=commit_count - settings.MAX_COMMITS_PER_PROJECT, id=project.id))
        commits_to_remove = ProjectCommit.objects.filter(commit_project=project.id)\
            .order_by('-commit_date')[settings.MAX_COMMITS_PER_PROJECT:]
        bulk_delete(ProjectCommit, commits_to_remove)