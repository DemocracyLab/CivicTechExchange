from django.apps import AppConfig
from django.conf import settings
from common.helpers.db import db_is_initialized


class CommonConfig(AppConfig):
    name = 'common'

    def ready(self):
        self.display_missing_environment_variables()
        from common.helpers.tags import import_tags_from_csv
        if db_is_initialized():
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
