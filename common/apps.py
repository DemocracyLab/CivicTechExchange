import sys
from django.apps import AppConfig
from django.conf import settings
from common.helpers.db import db_is_initialized
from salesforce import client


class CommonConfig(AppConfig):
    name = 'common'

    def ready(self):
        self.display_missing_environment_variables()
        #if settings.SALESFORCE_CONNECTED
        from common.helpers.tags import import_tags_from_csv
        if 'loaddata' in sys.argv:
            self.loaddata_clean()
        elif db_is_initialized():
            import_tags_from_csv()

    def display_missing_environment_variables(self):
        missing_required_variables = []
        for key, value in settings.ENVIRONMENT_VARIABLE_WARNINGS.items():
            if not (hasattr(settings, key)):
                if value['error']:
                    missing_required_variables.append(key)
                print(key + ' not set: ' + value['message'])
        if len(missing_required_variables) > 0:
            raise EnvironmentError('Required environment variables missing: ' + ','.join(missing_required_variables))

    def loaddata_clean(self):
        from django.contrib.contenttypes.models import ContentType
        ContentType.objects.all().delete()
