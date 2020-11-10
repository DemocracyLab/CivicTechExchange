from democracylab.models import Contributor, generate_uuid


def backfill_user_uuids(apps, schema_editor):
    for user in Contributor.objects.all():
        user.uuid = generate_uuid()
        user.save()