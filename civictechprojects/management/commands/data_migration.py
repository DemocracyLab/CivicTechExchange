from django.core.management.base import BaseCommand
from civictechprojects.migrations.data_migrations.migrate_location import migrate_locations_from_city_list
from civictechprojects.migrations.data_migrations.backfill_uuid import backfill_user_uuids

data_migrations = {
    "migrate_locations": migrate_locations_from_city_list,
    "backfill_user_uuids": backfill_user_uuids
}
data_migration_names = ','.join(data_migrations.keys())


class Command(BaseCommand):
    help = 'Perform data migrations'

    def add_arguments(self, parser):
        parser.add_argument('op')

    def handle(self, *args, **options):
        if 'op' not in options:
            print("Missing data migration argument.  Options: " + data_migration_names)
        else:
            op = options['op']
            if op not in data_migrations:
                print('Invalid data migration argument "{op}".  Options: {keys}'.format(op=op, keys=data_migration_names))
            else:
                data_migrations[op]()
