import traceback
from django.conf import settings
from civictechprojects.models import ProjectFile, FileCategory
from common.helpers.retry import retry
from common.helpers.s3 import copy_external_thumbnail_to_s3


class NotThumbnailException(Exception):
    """Raised when we attempt to download a thumbnail, and fail to download a usable image

    Attributes:
        not_thumbnail -- ProjectFile object representing the final file that was downloaded
    """

    def __init__(self, not_thumbnail):
        self.not_thumbnail = not_thumbnail


def upload_oauth_thumbnails():
    user_thumbnails = ProjectFile.objects.exclude(file_user=None).filter(file_category=FileCategory.THUMBNAIL.value)
    for thumbnail in user_thumbnails:
        if settings.S3_BUCKET not in thumbnail.file_url:
            print('Uploading OAuth thumbnail to s3 for user: ' + str(thumbnail.file_user.id))
            try:
                retry(func=lambda: _upload_thumbnail(thumbnail), retry_count=3, retry_seconds=2, job_name='Uploading ' + thumbnail.file_url)
            except Exception:
                # Keep processing if we run into errors with a particular thumbnail
                print(traceback.format_exc())
                print('Error uploading: ' + str(thumbnail))
                thumbnail.file_category = FileCategory.THUMBNAIL_ERROR.value
                thumbnail.save()
                pass


def _upload_thumbnail(thumbnail):
    file_json = copy_external_thumbnail_to_s3(thumbnail.file_url, 'UNKNOWN', thumbnail.file_user)
    new_file_category = file_json['file_category']
    if new_file_category != FileCategory.THUMBNAIL.value:
        not_thumbnail = ProjectFile.from_json(thumbnail.file_user, FileCategory(new_file_category), file_json)
        raise NotThumbnailException(not_thumbnail)
    ProjectFile.replace_single_file(thumbnail.file_user, FileCategory.THUMBNAIL, file_json,
                                    new_file_category=FileCategory(new_file_category))
