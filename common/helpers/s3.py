from boto3 import client
from django.conf import settings
from django.http import JsonResponse
from urllib import parse


def presign_s3_upload(key, file_type, acl):
    s3 = client('s3')

    presigned_post = s3.generate_presigned_post(
        Bucket=settings.S3_BUCKET,
        Key=key,
        Fields={"acl": acl, "Content-Type": file_type},
        Conditions=[
            {"acl": acl},
            {"Content-Type": file_type}
        ],
        ExpiresIn=3600
    )

    response = JsonResponse({
        'data': presigned_post,
        'url': 'https://%s.s3.amazonaws.com/%s' % (settings.S3_BUCKET, parse.quote_plus(key))
    })
    return response
