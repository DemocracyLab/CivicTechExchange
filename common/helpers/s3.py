import boto3
from boto3 import client
from django.conf import settings
from django.http import JsonResponse
from urllib import parse


class S3Key:
    def __init__(self, raw_key):
        key_parts = raw_key.split('/')
        self.file_category = key_parts[0]
        self.username = key_parts[1]
        self.file_name = key_parts[2]


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
        'url': 'https://%s.s3.amazonaws.com/%s' % (settings.S3_BUCKET, parse.quote_plus(raw_key))
    })
    return response


def delete_s3_file(raw_key):
    s3 = client('s3')
    response = s3.delete_object(Bucket=settings.S3_BUCKET, Key=raw_key)
    return response


def user_has_permission_for_s3_file(username, raw_key):
    s3_key = S3Key(raw_key)
    return username == s3_key.username


def copy_key_from_bucket(aws_access_key_id, aws_secret_access_key, from_bucket, to_bucket, old_key, new_key, file_name):
    s3 = boto3.resource('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

    content_disposition = 'attachment; filename="{0}"'.format(file_name)
    extra_args = {'ContentDisposition': content_disposition, 'ContentType': 'application/octet-stream',
                  'ACL': "public-read"}
    copy_source = {
        'Bucket': from_bucket,
        'Key': old_key
    }
    bucket = s3.Bucket(to_bucket)
    bucket.copy(copy_source, new_key, ExtraArgs=extra_args)

