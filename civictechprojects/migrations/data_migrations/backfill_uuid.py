from democracylab.models import Contributor
from common.helpers.random import generate_uuid


def backfill_user_uuids(apps, schema_editor):
    for user in Contributor.objects.all():
        user.uuid = generate_uuid()
        user.save()