import requests
from pprint import pprint
from mimetypes import guess_extension, guess_all_extensions
from boto3 import client
from django.conf import settings
from django.http import JsonResponse
from urllib import parse
from civictechprojects.models import FileCategory
from .random import generate_uuid
from .request_helpers import ResourceNotFound
from cryptography.fernet import Fernet

# define a encryption with a global key
key = b'yLyb7itt7-e0Z9eiPiX-lVnppwbK0v3TjQsk3J4ZgbY='
cipher_suite = Fernet(key)

class S3Key:
    def __init__(self, raw_key):
        key_parts = raw_key.split('/')
        self.file_category = key_parts[0]
        self.username = cipher_suite.decrypt(key_parts[1]).decode()
        self.file_name = key_parts[2]


def s3_key_to_public_url(key):
    return '{url}/{key}'.format(url=settings.S3_BUCKET_URL, key=parse.quote_plus(key))


def presign_s3_upload(raw_key, file_name, file_type, acl):
    s3 = client('s3')

    content_disposition = 'attachment; filename="{0}"'.format(file_name)
    presigned_post = s3.generate_presigned_post(
        Bucket=settings.S3_BUCKET,
        Key=raw_key,
        Fields={"acl": acl, "Content-Type": file_type, "Content-Disposition": content_disposition},
        Conditions=[
            {"acl": acl},
            {"Content-Type": file_type},
            {"Content-Disposition": content_disposition}
        ],
        ExpiresIn=3600
    )

    response = JsonResponse({
        'data': presigned_post,
        'url': s3_key_to_public_url(raw_key)
    })
    return response


def delete_s3_file(raw_key):
    s3 = client('s3')
    response = s3.delete_object(Bucket=settings.S3_BUCKET, Key=raw_key)
    return response


def user_has_permission_for_s3_file(username, raw_key):
    s3_key = S3Key(raw_key)
    return username == s3_key.username


def copy_external_thumbnail_to_s3(file_url, source, owner):
    # Download external file
    print('Downloading ' + file_url)
    key = f'avatar/{owner.id}/{source}_{generate_uuid()}'
    file_name_parts = key.split('.')
    file_name = "".join(file_name_parts[:-1])
    file_stream = requests.get(file_url, stream=True)
    file_data = file_stream.raw.read()
    pprint(file_stream.headers)
    if 'Content-Type' not in file_stream.headers:
        raise ResourceNotFound(file_url)
    content_type = file_stream.headers['Content-Type']
    is_image = 'image' in content_type
    # Add file extension if we can
    file_extension = guess_extension(content_type)
    key += file_extension
    print('Downloaded {url}, content type: {content_type}, file size: {size}'.
          format(url=file_url, content_type=content_type, size=len(file_data)))
    s3 = client('s3')
    content_disposition = 'attachment; filename="{0}"'.format(file_name)
    put_args = {
        'Body': file_data,
        'Bucket': settings.S3_BUCKET,
        'Key': key,
        'ACL': 'public-read',
        'ContentType': content_type,
        'ContentDisposition': content_disposition
    }
    if 'Content-Encoding' in file_stream.headers:
        put_args['ContentEncoding'] = file_stream.headers['Content-Encoding']
    response = s3.put_object(**put_args)
    print('Uploaded file to S3. Response Code: ' + str(response['ResponseMetadata']['HTTPStatusCode']))
    return {
        'publicUrl': s3_key_to_public_url(key),
        'file_user': owner,
        'file_category': FileCategory.THUMBNAIL.value if is_image else FileCategory.THUMBNAIL_ERROR.value,
        'visibility': 'PUBLIC',
        'fileName': f'{owner.first_name}{owner.last_name}_{source}_avatar_thumbnail.{file_extension}',
        'key': key
    }

