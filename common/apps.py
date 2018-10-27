from django.apps import AppConfig
from common.helpers.db import db_is_initialized


class CommonConfig(AppConfig):
    name = 'common'

    def ready(self):
        from common.helpers.tags import import_tags_from_csv
        if db_is_initialized():
            import_tags_from_csv()
