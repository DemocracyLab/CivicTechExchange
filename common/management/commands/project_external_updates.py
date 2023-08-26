from django.core.management.base import BaseCommand
from django.db.models import Prefetch
from django.conf import settings
from common.helpers.db import bulk_delete
from common.helpers.trello import get_board_actions
from common.helpers.github import fetch_github_info, get_owner_repo_name_from_public_url, \
    get_repo_endpoint_from_owner_repo_name, get_repo_names_from_owner_repo_name, get_branch_name_from_public_url
from common.helpers.date_helpers import datetime_field_to_datetime
import pytz
import traceback
from datetime import datetime, timedelta


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '--trello',
            action='store_true',
            help='Pull trello data instead',
        )

    def handle(self, *args, **options):
        if options['trello']:
            projects = get_projects_with_trello_links()
            #30 days ago
            created_since_date = (
                datetime.now() - timedelta(hours=720)).strftime('%Y-%m-%dT%H:%M:%SZ')
            print('Found {count} Projects w/ Trello Links, pulling actions created since {since}'.format(
                count=len(projects), since=created_since_date))
            for project in projects:
                try:
                    if project.is_searchable:
                        get_and_save_trello_actions(project, created_since_date)
                except Exception:
                    # Keep processing if we run into errors with a particular update
                    print('Error processing Project: {id}'.format(id=project.id))
                    print(traceback.format_exc())
                    pass
            return
        project_github_links = get_project_github_links()
        for github_link in project_github_links:
            try:
                if github_link.link_project.is_searchable:
                    handle_project_github_updates(github_link)
            except Exception:
                # Keep processing if we run into errors with a particular update
                print('Error processing Github Link: ' + github_link.link_url)
                print(traceback.format_exc())
                pass

def get_trello_board_id_from_url(url):
    board_id = None
    if url is not None:
        # it will be in the format http[s]://trello.com/b/boardid/....
        token = url.split('/')
        
        #board id will be at 4th position always
        if len(token) >= 5:
            board_id = token[4]
       
    return board_id


def get_and_save_trello_actions(project, created_since_date):
    """
    Retrieves actions for each project board link & saves to the db
    Expects that projects.trello_board_links is defined (see get_projects_with_trello_links)
    :param project: project 
    """
    project_actions = []
    for trello_link in project.trello_board_links:
        board_id = get_trello_board_id_from_url(trello_link.link_url)
        if board_id is not None:
            print('Pulling actions for project {id}, Trello link: {url}'.format(
                id=project.id, url=trello_link.link_url))
            try:
                board_actions = get_board_actions(board_id, created_since_date)
                print('Retrieved {num_actions} action(s) for board {board_id}'.format(
                    board_id=board_id, num_actions=len(board_actions)))
                project_actions += board_actions
            except Exception:
                # Keep processing if we run into errors with a particular update
                print('Error processing board: {id}'.format(id=board_id))
                print(traceback.format_exc())
                continue
        else:
            print('Unable to retrieve board id for trello url {}'.format(
                trello_link.link_url))
    if project_actions:
        latest_commit_date = push_trello_actions_to_db_and_get_latest(project, project_actions)
        update_if_commit_after_project_updated_time(
            project, latest_commit_date)



def push_trello_actions_to_db_and_get_latest(project, actions):
    from civictechprojects.models import TrelloAction

    #before pushing trello actions make sure to delete the table for PII
    if len(actions) > 0 :
        TrelloAction.objects.filter(action_project=project).delete()

    last_update_time = project.project_date_modified

    for action in actions:
        member = action.get("memberCreator", {})
        data = action.get("data", {})

        member_id = member.get("id")
        member_fullname = member.get("fullName")
        member_avatar_base_url = "" if member.get("avatarUrl", "") is None else member.get("avatarUrl", "")

        board_id = data.get("board",{}).get("id")
        action_type = action.get("type")
        action_date = action.get("date")

        id = action.get("id")

        action = TrelloAction.create(project,
                                     id,
                                     member_fullname,
                                     member_id,
                                     member_avatar_base_url,
                                     board_id,
                                     action_type,
                                     action_date,
                                     data)
        action_date = action.action_date
        if action_date > last_update_time:
            last_update_time = action_date
    return last_update_time

def get_projects_with_trello_links():
    """
    Queries for Trello Board Projects w/ Trello Board Project Links.
    Prefetches and filters the ProjectLinks relationship, available via the
    trello_board_links attribute
    """
    from civictechprojects.models import Project, ProjectLink
    return Project.objects\
        .prefetch_related(
            Prefetch(
                'links',
                queryset=ProjectLink.objects.filter(
                    link_url__icontains='trello.com/b', link_event__isnull=True),
                to_attr='trello_board_links')
        )\
        .distinct()


def get_project_github_links():
    from civictechprojects.models import ProjectLink
    return ProjectLink.objects.filter(link_project__isnull=False, link_event__isnull=True, link_group__isnull=True, link_url__icontains='github.com/')


def handle_project_github_updates(project_github_link):
    project = project_github_link.link_project
    print('Handling updates for project {id} github link: {url}'.format(
        id=project.id, url=project_github_link.link_url))
    last_updated_time = datetime_field_to_datetime(
        get_project_latest_commit_date(project_github_link.link_project))
    owner_repo_name = get_owner_repo_name_from_public_url(
        project_github_link.link_url)
    branch_name = get_branch_name_from_public_url(project_github_link.link_url)
    repo_names = get_repo_names_from_owner_repo_name(owner_repo_name)
    raw_commits = []
    for repo_name in repo_names:
        repo_url = get_repo_endpoint_from_owner_repo_name(
            repo_name, last_updated_time, branch_name)
        print('Ingesting: ' + repo_url)
        repo_info = fetch_github_info(repo_url)
        if repo_info is not None and len(repo_info) > 0:
            repo_display_name = repo_name[0] + '/' + repo_name[1]
            raw_commits = raw_commits + \
                list(
                    map(lambda commit: [repo_display_name, commit, branch_name], repo_info))

    if len(raw_commits) > 0:
        # Take the most recent top X commits
        raw_commits.sort(
            key=lambda commit: commit[1]['commit']['author']['date'], reverse=True)
        raw_commits = raw_commits[:settings.MAX_COMMITS_PER_PROJECT]
        add_commits_to_database(project, raw_commits)
        latest_commit_date = raw_commits[0][1]['commit']['author']['date']
        update_if_commit_after_project_updated_time(
            project, latest_commit_date)
        remove_old_commits(project)


def update_if_commit_after_project_updated_time(project, latest_commit_date_string):
    project_updated_time = datetime_field_to_datetime(
        project.project_date_modified)
    latest_commit_time = datetime_field_to_datetime(latest_commit_date_string)
    # Need to add timezone info to time from github
    if latest_commit_time.tzinfo is None:
        latest_commit_time = pytz.timezone("UTC").localize(latest_commit_time)
    if project_updated_time < latest_commit_time:
        print('Updating project {id} to latest timestamp: {time}'.format(
            id=project.id, time=latest_commit_date_string))
        project.update_timestamp(latest_commit_time)
        project.recache()
    else:
        print('Did not update project {id} because last commit at {commit_time} before project updated time {project_update}'.format(
            id=project.id,
            commit_time=latest_commit_date_string,
            project_update=project_updated_time))


def add_commits_to_database(project, commits_to_ingest):
    from civictechprojects.models import ProjectCommit
    for commit_info in commits_to_ingest:
        branch = commit_info[2] if commit_info[2] is not None else 'master'
        display_name = commit_info[0]
        commit = commit_info[1]
        ProjectCommit.create(project, display_name, branch, commit)
    project.recache()


def get_project_latest_commit_date(project):
    from civictechprojects.models import ProjectCommit
    latest_commit = ProjectCommit.objects.filter(
        commit_project=project.id).order_by('-commit_date').first()
    return latest_commit and latest_commit.commit_date


def remove_old_commits(project):
    from civictechprojects.models import ProjectCommit
    # Get the number of commits to delete
    commit_count = ProjectCommit.objects.filter(
        commit_project=project.id).count()
    # Delete them
    if commit_count > settings.MAX_COMMITS_PER_PROJECT:
        print('Deleting {ct} commits from project {id}'.format(
            ct=commit_count - settings.MAX_COMMITS_PER_PROJECT, id=project.id))
        commits_to_remove = ProjectCommit.objects.filter(commit_project=project.id)\
            .order_by('-commit_date')[settings.MAX_COMMITS_PER_PROJECT:]
        bulk_delete(ProjectCommit, commits_to_remove)
