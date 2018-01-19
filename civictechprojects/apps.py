from django.apps import AppConfig


class CivictechprojectsConfig(AppConfig):
    name = 'civictechprojects'

    def ready(self):
        # Remove any tags that aren't in the canonical tag list
        from .models import Project
        Project.remove_tags_not_in_list()
