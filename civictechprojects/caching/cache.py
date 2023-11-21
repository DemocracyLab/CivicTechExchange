from collections import Counter
from common.caching.cache import Cache
from common.helpers.dictionaries import merge_dicts

class ProjectCacheManager:
    _cache_key_prefix = 'project_'

    def get(self, project):
        return Cache.get(self._get_key(project))

    def refresh(self, project, value):
        print('Re-caching project ' + str(project))
        Cache.refresh(self._get_key(project), value)
        return value

    def _get_key(self, project):
        from civictechprojects.models import Project
        project_id = str(project.id) if isinstance(project, Project) else project
        return self._cache_key_prefix + project_id


ProjectCache = ProjectCacheManager()


class EventCacheManager:
    _cache_key_prefix = 'event_'

    def get(self, project):
        return Cache.get(self._get_key(project))

    def refresh(self, event, value):
        print('Re-caching event ' + str(event))
        Cache.refresh(self._get_key(event), value)
        return value

    def _get_key(self, event):
        from civictechprojects.models import Event
        event_id = str(event.id) if isinstance(event, Event) else event
        return self._cache_key_prefix + event_id


EventCache = EventCacheManager()


class EventProjectCacheManager:
    _cache_key_prefix = 'eventproject_'

    def get(self, event_project):
        return Cache.get(self._get_key(event_project))

    def refresh(self, event_project, value):
        print('Re-caching event project' + str(event_project))
        Cache.refresh(self._get_key(event_project), value)
        return value

    def _get_key(self, event_project):
        from civictechprojects.models import EventProject
        event_id = str(event_project.id) if isinstance(event_project, EventProject) else event_project
        return self._cache_key_prefix + event_id


EventProjectCache = EventProjectCacheManager()


class GroupCacheManager:
    _cache_key_prefix = 'group_'

    def get(self, group):
        return Cache.get(self._get_key(group))

    def refresh(self, group, value):
        print('Re-caching group ' + str(group))
        Cache.refresh(self._get_key(group), value)
        return value

    def _get_key(self, group):
        from civictechprojects.models import Group
        event_id = str(group.id) if isinstance(group, Group) else group
        return self._cache_key_prefix + event_id


GroupCache = GroupCacheManager()


# Caches the tag counts for project searches
class ProjectSearchTagsCacheManager:
    _cache_key_prefix = 'project_search_tags_'

    # Retrieve cached project tag counts for event, group, or all projects if both arguments=None
    def get(self, event=None, group=None):
        key = self._get_key(event=event, group=group)
        return Cache.get(key) or self.refresh(event=event, group=group)

    # Re-cache project tag counts for event, group, or all projects if both arguments=None
    def refresh(self, event=None, group=None):
        log_line = 'Re-caching tag counts'
        if event is not None:
            log_line += ' for event:' + str(event.id)
        elif group is not None:
            log_line += ' for group:' + str(group.id)
        print(log_line)
        key = self._get_key(event=event, group=group)
        value = self._projects_tag_counts(event=event, group=group)
        Cache.refresh(key, value)
        return value

    def _get_key(self, event=None, group=None):
        key = self._cache_key_prefix
        if event is not None:
            key += 'event_' + str(event.id)
        elif group is not None:
            key += 'group_' + str(group.id)
        else:
            key += 'all'
        return key

    @staticmethod
    def _projects_tag_counts(event=None, group=None):
        from civictechprojects.models import Project, ProjectPosition
        projects = None
        if event is not None:
            projects = event.get_linked_projects()
        elif group is not None:
            projects = group.get_group_projects(approved_only=True)
        else:
            projects = Project.objects.filter(is_searchable=True, is_private=False)
        issues, technologies, stage, organization, organization_type, positions = [], [], [], [], [], []
        if projects:
            for project in projects:
                issues += project.project_issue_area.slugs()
                technologies += project.project_technologies.slugs()
                stage += project.project_stage.slugs()
                organization += project.project_organization.slugs()
                organization_type += project.project_organization_type.slugs()

                project_positions = project.get_project_positions()
                # exclude roles which are hidden
                project_positions = project.get_project_positions().filter(is_hidden=False)                
                positions += map(lambda position: position.position_role.slugs()[0], project_positions)

            return merge_dicts(Counter(issues), Counter(technologies), Counter(stage), Counter(organization), Counter(organization_type), Counter(positions))


ProjectSearchTagsCache = ProjectSearchTagsCacheManager()


class UserContextCacheManager:
    _cache_key_prefix = 'user_'

    def get(self, user):
        return Cache.get(self._get_key(user))

    def refresh(self, user, value):
        print('Re-caching user context for user:' + str(user.id))
        Cache.refresh(self._get_key(user), value, 300)
        return value

    def clear(self, user):
        print('Clearing user context for user:' + str(user.id))
        Cache.clear(self._get_key(user))

    def _get_key(self, user):
        return self._cache_key_prefix + str(user.id)


UserContextCache = UserContextCacheManager()

class ImpactDashboardCacheManager:
    _cache_key_prefix = 'impact_'

    def get(self, stats):
        return Cache.get(self._get_key(stats))

    def refresh(self, stats, value, timeout):
        print('Re-caching project ' + str(stats))
        Cache.refresh(self._get_key(stats), value, timeout)
        return value

    def _get_key(self, stats):
        return self._cache_key_prefix + stats


ImpactDashboardCache = ImpactDashboardCacheManager()
