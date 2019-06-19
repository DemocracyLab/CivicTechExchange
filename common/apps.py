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
        for key, value in settings.ENVIRONMENT_VARIABLE_WARNINGS.items():
            if not hasattr(settings, key):
                print(value['message'])
