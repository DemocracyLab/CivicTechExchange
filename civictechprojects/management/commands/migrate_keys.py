from django.core.management import BaseCommand
from common.helpers.s3 import copy_key_from_bucket
from civictechprojects.models import ProjectFile
import urllib.parse
import traceback


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--bucket_name', type=str)
        parser.add_argument('--public_key', type=str)
        parser.add_argument('--private_key', type=str)
        parser.add_argument('--do_copy', action='store_true', dest='do_copy', default=False)
        parser.add_argument('--update_db', action='store_true', dest='update_db', default=False)

    def handle(self, *args, **options):
        project_files = ProjectFile.objects.all()
        do_copy = options['do_copy']
        update_db = options['update_db']
        public_key = options['public_key']
        private_key = options['private_key']
        to_bucket = options['bucket_name']

        for project_file in project_files:

            try:
                file_name, new_file_name = get_new_file_name(project_file)
                from_bucket = parse_bucket_name(project_file.file_url)

                if do_copy:
                    copy_key_from_bucket(aws_access_key_id=public_key, aws_secret_access_key=private_key,
                                         from_bucket=from_bucket, to_bucket=to_bucket,
                                         old_key=project_file.file_key, new_key=new_file_name,
                                         file_name=file_name)

                if update_db:
                    update_in_db(from_bucket, new_file_name, project_file, to_bucket)

            except Exception:
                print('Error processing ' + project_file.file_key)
                print(traceback.format_exc())


def update_in_db(from_bucket, new_file_name, project_file, to_bucket):
    file_url = project_file.file_url.replace(from_bucket, to_bucket)
    file_url = file_url.replace(urllib.parse.quote_plus(project_file.file_key), urllib.parse.quote(new_file_name))
    project_file.file_url = file_url
    project_file.file_key = new_file_name
    project_file.save()


def get_new_file_name(project_file):
    file_source = get_file_source(project_file)

    file_key = project_file.file_key
    file_key = file_key[file_key.rfind('/')+1:file_key.find('.'+project_file.file_type)]

    file_split = project_file.file_key.split('.' + project_file.file_type)
    date_time = file_split[1].replace('_', '')

    new_file_name = f"uploads/{file_source}/{project_file.id}/{file_key}_" \
                    f"{date_time}.{project_file.file_type}"

    return file_key, new_file_name


def get_file_source(project_file):
    attributes = ['file_project', 'file_user', 'file_group', 'file_event']
    for attribute in attributes:
        if getattr(project_file, attribute):
            return attribute.split('_')[1]


def parse_bucket_name(file_url):
    path_parts = file_url.replace("https://", "").split(".s3.amazonaws.com")
    return path_parts.pop(0)

