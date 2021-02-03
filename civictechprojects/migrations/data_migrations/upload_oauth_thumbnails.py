import traceback
from django.conf import settings
from civictechprojects.models import ProjectFile, FileCategory
from common.helpers.s3 import copy_external_file_to_s3


def upload_oauth_thumbnails():
    user_thumbnails = ProjectFile.objects.exclude(file_user=None).filter(file_category=FileCategory.THUMBNAIL.value)
    for thumbnail in user_thumbnails:
        if settings.S3_BUCKET not in thumbnail.file_url:
            owner = thumbnail.file_user
            print('Uploading OAuth thumbnail to s3 for user: ' + str(owner.id))
            try:
                file_json = copy_external_file_to_s3(thumbnail.file_url, 'UNKNOWN', owner)
                # TODO: Remove logging after testing
                from pprint import pprint
                pprint(file_json)
                ProjectFile.replace_single_file(owner, FileCategory.THUMBNAIL, file_json)
            except:
                # Keep processing if we run into errors with a particular thumbnail
                print('Error uploading: ' + thumbnail.file_url)
                print(traceback.format_exc())
                pass
