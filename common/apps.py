from django.apps import AppConfig


class CommonConfig(AppConfig):
    name = 'common'

    def ready(self):
        from .models.tags import import_tags_from_csv
        import_tags_from_csv()