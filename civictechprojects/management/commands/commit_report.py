import csv
import math
import os
import traceback
from datetime import timedelta, datetime

from django.core.management.base import BaseCommand

from common.helpers.date_helpers import datetime_field_to_datetime
from common.helpers.github import fetch_github_info, get_owner_repo_name_from_public_url, \
    get_repo_endpoint_from_owner_repo_name, get_repo_names_from_owner_repo_name
from common.helpers.s3 import upload_file_to_s3

COLUMN_MAP = {
    'project_name': 'Project Name',
    'repo_name': 'Repo Name',
    'date_joined': 'Date Joined Democracylab',
    'avg_commit_pre_dl': 'Avg Commits/wk before joining',
    'avg_commit_post_dl': 'Avg Commits/wk after joining',
    'change_in_avg_commit': 'Change in Avg Commits after joining'
}

FIELD_FORMATS = {
    'Change in Avg Commits after joining': '%s%%'
}


class TypedWriter:
    def __init__(self, f, fieldnames, fieldformats, column_map, **kwds):
        self.writer = csv.DictWriter(f, fieldnames, **kwds)
        self.formats = fieldformats
        self.column_map = column_map

    def writeheader(self):
        self.writer.writeheader()

    def writerow(self, row):
        final_dict = dict()
        for k, v in row.items():
            mod_k = self.column_map[k]
            if mod_k in self.formats and v is not None:
                v = self.formats[mod_k] % v
            final_dict[mod_k] = v

        self.writer.writerow(final_dict)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)


class Command(BaseCommand):
    def handle(self, *args, **options):
        create_report()


def create_report():
    project_github_links = get_project_github_links()
    project_list = list()
    project_id_set = set()
    for github_link in project_github_links:

        if not github_link.link_project.is_searchable or\
                github_link.link_project.project_date_created is None:
            continue

        try:
            if github_link.link_project.id not in project_id_set:
                create_commit_report(github_link, project_list)
                project_id_set.add(github_link.link_project.id)
        except:
            print('Error processing ' + github_link.link_url)
            print(traceback.format_exc())

    calculate_total_commit(project_list)
    write_to_csv(project_list)


def calculate_total_commit(project_list, project_name='All Projects'):
    total_commit = 0
    count = 0
    for project_data in project_list:
        avg_commit = project_data.get('change_in_avg_commit')
        if avg_commit is not None:
            total_commit += avg_commit
            count += 1

    if count != 0:
        repo_dict = {'project_name': project_name, 'change_in_avg_commit': total_commit/count}
        project_list.append(repo_dict)


def get_project_github_links():
    from civictechprojects.models import ProjectLink
    return ProjectLink.objects.filter(link_name='link_coderepo', link_url__icontains='github.com/').exclude(link_project=None)


def create_commit_report(project_github_link, project_list):
    project = project_github_link.link_project
    print('Handling updates for project {id} github link: {url}'.format(id=project.id, url=project_github_link.link_url))
    last_updated_time = datetime_field_to_datetime(get_project_joining_date(project_github_link.link_project))
    owner_repo_name = get_owner_repo_name_from_public_url(project_github_link.link_url)
    repo_names = get_repo_names_from_owner_repo_name(owner_repo_name)

    project_repo_list = list()
    for repo_name in repo_names:
        repo_url = get_repo_endpoint_from_owner_repo_name(repo_name, last_updated_time)
        print('Ingesting: ' + repo_url)

        commit_info = fetch_github_info(repo_url, include_pagination=True)

        if not commit_info:
            continue

        commit_post_dl = 0
        for commit in commit_info:
            commit_date_text = commit.get('commit').get('author').get('date')
            commit_date = datetime.strptime(commit_date_text, "%Y-%m-%dT%H:%M:%SZ").date()
            if project.project_date_created.date() < commit_date:
                commit_post_dl += 1
            else:
                break

        repo_dict = populate_repo_statistics(commit_info, commit_post_dl, project, repo_name)
        project_repo_list.append(repo_dict)

    calculate_total_commit(project_repo_list, project_name=project.project_name)
    project_list.extend(project_repo_list)


def populate_repo_statistics(commit_info, commit_post_dl, project, repo_name):

    last_commit_date_pre_dl = commit_info[-1].get('commit').get('author').get('date')
    last_commit_date_pre_dl = datetime.strptime(last_commit_date_pre_dl, "%Y-%m-%dT%H:%M:%SZ").date()

    no_of_weeks_post_dl = (datetime.utcnow().date() - project.project_date_created.date()).days // 7
    no_of_weeks_pre_dl = (project.project_date_created.date() - last_commit_date_pre_dl).days // 7

    commit_pre_dl = len(commit_info) - commit_post_dl
    avg_commit_pre_dl = math.ceil(commit_pre_dl / no_of_weeks_pre_dl) if no_of_weeks_pre_dl > 0 else 0
    avg_commit_post_dl = math.ceil(commit_post_dl / no_of_weeks_post_dl) if no_of_weeks_post_dl > 0 else 0

    change_in_avg_commit = (100 * (avg_commit_post_dl - avg_commit_pre_dl) / avg_commit_pre_dl)\
        if commit_pre_dl > 0 and avg_commit_pre_dl > 0 else None

    repo_dict = {'project_name': project.project_name,
                 'repo_name': repo_name[1],
                 'date_joined': project.project_date_created.date().strftime('%m/%d/%Y'),
                 'avg_commit_pre_dl': avg_commit_pre_dl,
                 'avg_commit_post_dl': avg_commit_post_dl,
                 'change_in_avg_commit': change_in_avg_commit
                 }

    return repo_dict


def get_project_joining_date(project):
    return datetime_field_to_datetime(project.project_date_created) - timedelta(days=365)


def write_to_csv(project_list):
    csv_columns = [COLUMN_MAP[k] for k, v in COLUMN_MAP.items()]
    file_name = 'commit_report_' + str(datetime.utcnow().strftime('%Y-%m-%d_%H:%M:%S'))+ '.csv'
    with open(file_name, 'w') as csv_file:
        writer = TypedWriter(csv_file, fieldnames=csv_columns,
                             fieldformats=FIELD_FORMATS,
                             column_map=COLUMN_MAP)
        writer.writeheader()
        for idx, data in enumerate(project_list):

            if idx == len(project_list) - 1:
                csv_file.write('\n')

            writer.writerow(data)

    file_path = os.path.join(os.getcwd(), file_name)
    s3_file_key = 'report/' + file_name
    upload_file_to_s3(file_name=file_name, file_path=file_path, s3_file_key=s3_file_key, file_type='text/csv')

    print(f'Commit Report completed - {file_name}')
