from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.db import models
from django.utils import timezone
from django.contrib.gis.db.models import PointField
from enum import Enum
from itertools import chain
from democracylab.models import Contributor
from common.models.tags import Tag
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase
from civictechprojects.caching.cache import ProjectCache, GroupCache, EventCache, ProjectSearchTagsCache
from common.helpers.form_helpers import is_json_field_empty, is_creator_or_staff
from common.helpers.dictionaries import merge_dicts, keys_subset
from common.helpers.collections import flatten, count_occurrences
from salesforce import volunteer_hours as salesforce_volunteer

# Without the following classes, the following error occurs:
#
#   ValueError: You can't have two TaggableManagers with the same
#   through model.
#
# By default, the `through` field is the same across both TaggableManagers
# because when the parameter is omitted, identical defaults are provided.
# See: https://django-taggit.readthedocs.io/en/latest/api.html#TaggableManager
class TaggedIssueAreas(TaggedItemBase):
    content_object = models.ForeignKey('Project', on_delete=models.CASCADE)


class TaggedStage(TaggedItemBase):
    content_object = models.ForeignKey('Project', on_delete=models.CASCADE)


class TaggedTechnologies(TaggedItemBase):
    content_object = models.ForeignKey('Project', on_delete=models.CASCADE)


class TaggedOrganization(TaggedItemBase):
    content_object = models.ForeignKey('Project', on_delete=models.CASCADE)


class TaggedOrganizationType(TaggedItemBase):
    content_object = models.ForeignKey('Project', on_delete=models.CASCADE)


class ArchiveManager(models.Manager):
    def get_queryset(self):
        return super(ArchiveManager, self).get_queryset().filter(deleted=True)


class DefaultManager(models.Manager):
    def get_queryset(self):
        return super(DefaultManager, self).get_queryset().filter(deleted=False)

# This base class adds delete functionality to models using a flag, and filters deleted items out of the default result set
class Archived(models.Model):
    class Meta:
        abstract = True

    objects = DefaultManager()
    archives = ArchiveManager()
    deleted = models.BooleanField(default=False)

    def delete(self):
        self.deleted = True
        self.save()


class Project(Archived):
    project_creator = models.ForeignKey(Contributor, related_name='created_projects', on_delete=models.CASCADE)
    project_description = models.CharField(max_length=4000, blank=True)
    project_description_solution = models.CharField(max_length=4000, blank=True)
    project_description_actions = models.CharField(max_length=4000, blank=True)
    project_short_description = models.CharField(max_length=140, blank=True)
    project_issue_area = TaggableManager(blank=True, through=TaggedIssueAreas)
    project_issue_area.remote_field.related_name = 'issue_projects'
    project_stage = TaggableManager(blank=True, through=TaggedStage)
    project_stage.remote_field.related_name = related_name='stage_projects'
    project_technologies = TaggableManager(blank=True, through=TaggedTechnologies)
    project_technologies.remote_field.related_name = 'technology_projects'
    project_organization = TaggableManager(blank=True, through=TaggedOrganization)
    project_organization.remote_field.related_name = 'org_projects'
    project_organization_type = TaggableManager(blank=True, through=TaggedOrganizationType)
    project_organization_type.remote_field.related_name = 'org_type_projects'
    project_location = models.CharField(max_length=200, blank=True)
    project_location_coords = PointField(null=True, blank=True, srid=4326, default='POINT EMPTY')
    project_country = models.CharField(max_length=100, blank=True)
    project_state = models.CharField(max_length=100, blank=True)
    project_city = models.CharField(max_length=100, blank=True)
    project_name = models.CharField(max_length=200)
    project_url = models.CharField(max_length=2083, blank=True)
    project_date_created = models.DateTimeField(null=True)
    project_date_modified = models.DateTimeField(auto_now_add=True, null=True)
    is_searchable = models.BooleanField(default=False)
    is_created = models.BooleanField(default=True)
    _full_text_capacity = 200000
    full_text = models.CharField(max_length=_full_text_capacity, blank=True)

    def __str__(self):
        return str(self.id) + ':' + str(self.project_name)

    def delete(self):
        self.is_searchable=False
        self.update_timestamp()
        super().delete()

    def all_owners(self):
        owners = [self.project_creator]
        project_volunteers = VolunteerRelation.objects.filter(project=self.id)
        project_co_owners = filter(lambda pv: pv.is_co_owner, project_volunteers)

        return owners + list(map(lambda pv: pv.volunteer, project_co_owners))

    def hydrate_to_json(self):
        return ProjectCache.get(self) or ProjectCache.refresh(self, self._hydrate_to_json())

    def _hydrate_to_json(self):
        files = ProjectFile.objects.filter(file_project=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))
        links = ProjectLink.objects.filter(link_project=self.id)
        positions = ProjectPosition.objects.filter(position_project=self.id).order_by('order_number')
        volunteers = VolunteerRelation.objects.filter(project=self.id)
        group_relationships = ProjectRelationship.objects.filter(relationship_project=self).exclude(relationship_group=None)
        commits = ProjectCommit.objects.filter(commit_project=self.id).order_by('-commit_date')[:20]
        trello_actions = TrelloAction.objects.filter(
            action_project=self.id).order_by('-action_date')[:20]
        actions = sorted(chain(commits, trello_actions), reverse=True, key=lambda x: getattr(
            x, 'commit_date', getattr(x, 'action_date', '')))
        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'project_claimed': not self.project_creator.is_admin_contributor(),
            'project_created': self.is_created,
            'project_approved': self.is_searchable,
            'project_description': self.project_description,
            'project_description_solution': self.project_description_solution,
            'project_description_actions': self.project_description_actions,
            'project_short_description': self.project_short_description,
            'project_url': self.project_url,
            'project_location': self.project_location,
            'project_country': self.project_country,
            'project_state': self.project_state,
            'project_city': self.project_city,
            'project_organization': Tag.hydrate_to_json(self.id, list(self.project_organization.all().values())),
            'project_organization_type': Tag.hydrate_to_json(self.id, list(self.project_organization_type.all().values())),
            'project_issue_area': Tag.hydrate_to_json(self.id, list(self.project_issue_area.all().values())),
            'project_stage': Tag.hydrate_to_json(self.id, list(self.project_stage.all().values())),
            'project_technologies': Tag.hydrate_to_json(self.id, list(self.project_technologies.all().values())),
            'project_positions': list(map(lambda position: position.to_json(), positions)),
            'project_files': list(map(lambda file: file.to_json(), other_files)),
            'project_links': list(map(lambda link: link.to_json(), links)),
            'project_actions': list(map(lambda action: action.to_json(), actions)),
            'project_groups': list(map(lambda gr: gr.hydrate_to_list_json(), group_relationships)),
            'project_events': list(map(lambda er: er.hydrate_to_tile_json(), self.get_project_events())),
            'project_owners': [self.project_creator.hydrate_to_tile_json()],
            'project_volunteers': list(map(lambda volunteer: volunteer.to_json(), volunteers)),
            'project_date_modified': self.project_date_modified.__str__()
        }

        if self.project_location_coords is not None and not self.project_location_coords.empty:
            project['project_latitude'] = self.project_location_coords.x
            project['project_longitude'] = self.project_location_coords.y

        if len(thumbnail_files) > 0:
            project['project_thumbnail'] = thumbnail_files[0].to_json()

        return project

    def hydrate_to_tile_json(self):
        keys = [
            'project_id', 'project_name', 'project_creator',  'project_url', 'project_location', 'project_country',
            'project_state', 'project_city', 'project_issue_area', 'project_stage', 'project_positions',
            'project_date_modified', 'project_thumbnail', 'project_description'
        ]
        json_base = self.hydrate_to_json()
        json_result = keys_subset(json_base, keys)
        project_short_description = json_base['project_short_description']
        if len(project_short_description) > 0:
            json_result['project_description'] = project_short_description

        return json_result

    def hydrate_to_list_json(self):
        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'isApproved': self.is_searchable,
            'isCreated': self.is_created
        }

        return project

    def get_project_events(self):
        slugs = list(map(lambda tag: tag['slug'], self.project_organization.all().values()))
        return Event.objects.filter(event_legacy_organization__name__in=slugs, is_private=False, is_searchable=True)

    def get_project_groups(self):
        project_relationships = ProjectRelationship.objects.filter(relationship_project=self.id)
        groups_ids = list(map(lambda pr: pr.relationship_group.id, project_relationships))
        return Group.objects.filter(id__in=groups_ids)

    def update_timestamp(self, time=None):
        self.project_date_modified = time or timezone.now()
        self.save()

    def recache(self, recache_linked=False):
        hydrated_project = self._hydrate_to_json()
        ProjectCache.refresh(self, hydrated_project)
        self.generate_full_text()
        if recache_linked:
            self.update_linked_items()

    def update_linked_items(self):
        # Recache events, but only if project is searchable
        if self.is_searchable:
            owned_events = self.get_project_events()
            for event in owned_events:
                event.recache()

    def generate_full_text(self):
        base_json = self.hydrate_to_json()
        # Don't cache external entities because they take up space and aren't useful in project search
        omit_fields = ['project_volunteers', 'project_owners', 'project_events', 'project_groups', 'project_commits']
        # Don't cache files because they contain noise without adequate signal
        omit_fields += ['project_thumbnail', 'project_files']
        # Don't cache boolean fields
        omit_fields += ['project_claimed', 'project_approved']
        # Don't cache numeric fields
        omit_fields += ['project_id', 'project_creator', 'project_latitude', 'project_longitude']
        # Don't cache date fields
        omit_fields += ['project_date_modified']
        for field in omit_fields:
            base_json.pop(field, None)
        full_text = str(base_json)
        if len(full_text) >= Project._full_text_capacity:
            full_text = full_text[:Project._full_text_capacity - 1]
            print('Project Full Text Field Overflow Alert: ' + self.__str__())
        self.full_text = full_text
        self.save()


class Group(Archived):
    group_creator = models.ForeignKey(Contributor, related_name='group_creator', on_delete=models.CASCADE)
    group_date_created = models.DateTimeField(null=True)
    group_date_modified = models.DateTimeField(auto_now_add=True, null=True)
    group_description = models.CharField(max_length=4000, blank=True)
    group_url = models.CharField(max_length=2083, blank=True)
    group_location = models.CharField(max_length=200, blank=True)
    group_location_coords = PointField(null=True, blank=True, srid=4326, default='POINT EMPTY')
    group_country = models.CharField(max_length=100, blank=True)
    group_state = models.CharField(max_length=100, blank=True)
    group_city = models.CharField(max_length=100, blank=True)
    group_name = models.CharField(max_length=200)
    group_short_description = models.CharField(max_length=140, blank=True)
    is_searchable = models.BooleanField(default=False)
    is_created = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id) + ':' + str(self.group_name)

    def delete(self):
        self.is_searchable = False
        super().delete()

    def update_timestamp(self):
        self.group_date_modified = timezone.now()
        self.save()

    def hydrate_to_json(self):
        return GroupCache.get(self) or GroupCache.refresh(self, self._hydrate_to_json())

    def _hydrate_to_json(self):
        files = ProjectFile.objects.filter(file_group=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))
        links = ProjectLink.objects.filter(link_group=self.id)
        projects = self.get_group_project_relationships(approved_only=True)

        group = {
            'group_creator': self.group_creator.id,
            'group_date_modified': self.group_date_modified.__str__(),
            'group_description': self.group_description,
            'group_files': list(map(lambda file: file.to_json(), other_files)),
            'group_id': self.id,
            'group_links': list(map(lambda link: link.to_json(), links)),
            'group_url': self.group_url,
            'group_name': self.group_name,
            'group_location': self.group_location,
            'group_country': self.group_country,
            'group_state': self.group_state,
            'group_city': self.group_city,
            'group_owners': [self.group_creator.hydrate_to_tile_json()],
            'group_short_description': self.group_short_description,
            'group_project_count': projects.count()
        }

        if len(projects) > 0:
            group['group_issue_areas'] = self.get_project_issue_areas(with_counts=True, project_relationships=projects)

        if len(thumbnail_files) > 0:
            group['group_thumbnail'] = thumbnail_files[0].to_json()

        return group

    def hydrate_to_tile_json(self):
        keys = [
            'group_date_modified', 'group_id', 'group_name', 'group_location', 'group_country', 'group_state',
            'group_city', 'group_short_description', 'group_project_count', 'group_issue_areas', 'group_thumbnail'
        ]

        return keys_subset(self.hydrate_to_json(), keys)
    
    def hydrate_to_list_json(self):
        files = ProjectFile.objects.filter(file_group=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))

        group = {
            'group_date_modified': self.group_date_modified.__str__(),
            'group_id': self.id,
            'group_name': self.group_name,
            'group_creator': self.group_creator.id,
            'isApproved': self.is_searchable,
            'isCreated': self.is_created
        }

        if len(thumbnail_files) > 0:
            group['group_thumbnail'] = thumbnail_files[0].to_json()

        return group

    def get_project_issue_areas(self, with_counts, project_relationships=None):
        if project_relationships is None:
            project_relationships = ProjectRelationship.objects.filter(relationship_group=self.id)
        all_issue_areas = flatten(list(map(lambda p: p.relationship_project.project_issue_area.all().values(), project_relationships)))
        all_issue_area_names = list(map(lambda issue_tag: issue_tag['name'], all_issue_areas))
        if with_counts:
            issue_area_counts = count_occurrences(all_issue_area_names)
            return issue_area_counts
        else:
            return list(set(all_issue_area_names))

    def get_group_project_relationships(self, approved_only=True):
        project_relationships = ProjectRelationship.objects.filter(relationship_group=self.id)
        if approved_only:
            project_relationships = project_relationships.filter(is_approved=True, relationship_project__is_searchable=True)
        return project_relationships

    def get_group_projects(self, approved_only=True):
        project_ids = list(map(lambda pr: pr.relationship_project.id, self.get_group_project_relationships(approved_only=approved_only)))
        return Project.objects.filter(id__in=project_ids)

    def recache(self):
        hydrated_group = self._hydrate_to_json()
        GroupCache.refresh(self, hydrated_group)
        ProjectSearchTagsCache.refresh(event=None, group=self)

    def update_linked_items(self):
        # Recache linked projects
        project_relationships = ProjectRelationship.objects.filter(relationship_group=self)
        for project_relationship in project_relationships:
            project_relationship.relationship_project.recache(recache_linked=False)


class TaggedEventOrganization(TaggedItemBase):
    content_object = models.ForeignKey('Event', on_delete=models.CASCADE)


class Event(Archived):
    event_agenda = models.CharField(max_length=4000, blank=True)
    event_creator = models.ForeignKey(Contributor, related_name='event_creator', on_delete=models.CASCADE)
    event_date_created = models.DateTimeField(null=True)
    event_date_end = models.DateTimeField()
    event_date_modified = models.DateTimeField(auto_now_add=True, null=True)
    event_date_start = models.DateTimeField()
    event_description = models.CharField(max_length=4000, blank=True)
    event_organizers_text = models.CharField(max_length=200, blank=True)
    event_location = models.CharField(max_length=200, blank=True)
    event_name = models.CharField(max_length=200)
    event_rsvp_url = models.CharField(max_length=2083, blank=True)
    event_live_id = models.CharField(max_length=50, blank=True)
    event_short_description = models.CharField(max_length=140, blank=True)
    event_legacy_organization = TaggableManager(blank=True, through=TaggedEventOrganization)
    event_legacy_organization.remote_field.related_name = 'org_events'
    event_slug = models.CharField(max_length=100, blank=True)
    is_private = models.BooleanField(default=False)
    is_searchable = models.BooleanField(default=False)
    is_created = models.BooleanField(default=True)
    show_headers = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id) + ':' + str(self.event_name)

    def delete(self):
        self.is_searchable=False
        super().delete()

    def update_timestamp(self):
        self.event_date_modified = timezone.now()
        self.save()

    def hydrate_to_json(self):
        return EventCache.get(self) or EventCache.refresh(self, self._hydrate_to_json())

    def _hydrate_to_json(self):
        files = ProjectFile.objects.filter(file_event=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))

        event = {
            'event_agenda': self.event_agenda,
            'event_creator': self.event_creator.id,
            'event_date_end': self.event_date_end.__str__(),
            'event_date_modified': self.event_date_modified.__str__(),
            'event_date_start': self.event_date_start.__str__(),
            'event_description': self.event_description,
            'event_files': list(map(lambda file: file.to_json(), other_files)),
            'event_id': self.id,
            'event_location': self.event_location,
            'event_rsvp_url': self.event_rsvp_url,
            'event_live_id': self.event_live_id,
            'event_name': self.event_name,
            'event_organizers_text': self.event_organizers_text,
            'event_owners': [self.event_creator.hydrate_to_tile_json()],
            'event_short_description': self.event_short_description,
            'event_legacy_organization': Tag.hydrate_to_json(self.id, list(self.event_legacy_organization.all().values())),
            'event_slug': self.event_slug,
            'is_private': self.is_private,
            'show_headers': self.show_headers
        }

        if len(thumbnail_files) > 0:
            event['event_thumbnail'] = thumbnail_files[0].to_json()

        return event

    def hydrate_to_tile_json(self):
        keys = [
            'event_date_end', 'event_date_start', 'event_id', 'event_slug', 'event_location', 'event_name',
            'event_organizers_text', 'event_short_description', 'event_thumbnail'
        ]

        return keys_subset(self.hydrate_to_json(), keys)

    def hydrate_to_list_json(self):
        event = self.hydrate_to_tile_json()
        event['event_creator'] = self.event_creator.id
        event['is_searchable'] = self.is_searchable
        event['is_created'] = self.is_created

        return event

    @staticmethod
    def get_by_id_or_slug(slug):
        event = None
        if slug is not None:
            _slug = slug.strip().lower()
            if _slug.isnumeric():
                event = Event.objects.get(id=_slug)
            elif len(_slug) > 0:
                event = Event.objects.filter(event_slug=_slug).first() or NameRecord.get_event(_slug)

        return event

    def get_issue_areas(self):
        project_relationships = ProjectRelationship.objects.filter(relationship_event=self.id)
        project_ids = list(map(lambda relationship: relationship.relationship_project.id, project_relationships))
        project_list = Project.objects.filter(id__in=project_ids)

        return [Tag.hydrate_to_json(project.id, list(project.project_issue_area.all().values())) for project in project_list]

    def get_linked_projects(self):
        # Get projects by legacy organization
        projects = None
        legacy_org_slugs = self.event_legacy_organization.slugs()
        if legacy_org_slugs and len(legacy_org_slugs) > 0:
            projects = Project.objects.filter(project_organization__name__in=legacy_org_slugs)
        return projects

    def update_linked_items(self):
        # Recache linked projects
        projects = self.get_linked_projects()
        if projects:
            for project in projects:
                project.recache(recache_linked=False)

    def recache(self):
        hydrated_event = self._hydrate_to_json()
        EventCache.refresh(self, hydrated_event)
        ProjectSearchTagsCache.refresh(event=self)


class NameRecord(models.Model):
    event = models.ForeignKey(Event, related_name='old_slugs', blank=True, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True)

    @staticmethod
    def get_event(name):
        record = NameRecord.objects.filter(name=name).first()
        return record and record.event

    @staticmethod
    def delete_record(name):
        record = NameRecord.objects.filter(name=name).first()
        if record:
            record.delete()
            return True
        else:
            return False


class ProjectRelationship(models.Model):
    relationship_project = models.ForeignKey(Project, related_name='relationships', blank=True, null=True, on_delete=models.CASCADE)
    relationship_group = models.ForeignKey(Group, related_name='relationships', blank=True, null=True, on_delete=models.CASCADE)
    relationship_event = models.ForeignKey(Event, related_name='relationships', blank=True, null=True, on_delete=models.CASCADE)
    introduction_text = models.CharField(max_length=10000, blank=True)
    project_initiated = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        if self.relationship_group is not None:
            project_counterpart = ('Group', self.relationship_group)
        elif self.relationship_event is not None:
            project_counterpart = ('Event', self.relationship_event)
        return "{proj} - ({type}) {counterpart}".format(
            proj=self.relationship_project.__str__(),
            type=project_counterpart[0],
            counterpart=project_counterpart[1].__str__())

    @staticmethod
    def create(owner, project, approved=False, introduction_text=""):
        relationship = ProjectRelationship()
        relationship.project_initiated = False
        relationship.relationship_project = project
        relationship.introduction_text = introduction_text

        if type(owner) is Group:
            relationship.relationship_group = owner
            relationship.is_approved = approved
        else:
            relationship.relationship_event = owner
            relationship.is_approved = True
        
        return relationship

    def is_group_relationship(self):
        return self.relationship_group is not None

    def hydrate_to_list_json(self):
        list_json = {
            'project_relationship_id': self.id,
            'relationship_is_approved': self.is_approved
        }
        if self.is_group_relationship():
            list_json = merge_dicts(list_json, self.relationship_group.hydrate_to_list_json())

        return list_json

    def hydrate_to_project_tile_json(self):
        list_json = {
            'project_relationship_id': self.id,
            'relationship_is_approved': self.is_approved
        }
        list_json = merge_dicts(list_json, self.relationship_project.hydrate_to_tile_json())

        return list_json


class ProjectCommit(models.Model):
    commit_project = models.ForeignKey(Project, related_name='commits', blank=True, null=True, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=200)
    user_link = models.CharField(max_length=2083)
    user_avatar_link = models.CharField(max_length=2083)
    commit_date = models.DateTimeField()
    commit_sha = models.CharField(max_length=40)
    commit_title = models.CharField(max_length=2000)
    branch_name = models.CharField(max_length=200)
    repo_name = models.CharField(max_length=200)

    def __str__(self):
        return "({repo}) {sha}: {title}".format(repo=self.repo_name, sha=self.commit_sha[:6], title=self.commit_title)

    @staticmethod
    def create(project, repo_name, branch_name, github_json):
        commit_sha = github_json['sha']
        existing_commit = ProjectCommit.objects.filter(commit_sha=commit_sha, commit_project=project.id)
        if existing_commit.count() == 0:
            project_commit = ProjectCommit()
            project_commit.commit_project = project
            project_commit.repo_name = repo_name
            project_commit.branch_name = branch_name
            project_commit.commit_sha = commit_sha

            commit_section = github_json['commit']
            project_commit.commit_title = commit_section['message'][:2000]
            project_commit.commit_date = commit_section['author']['date']

            author_section = github_json['author']
            if author_section:
                project_commit.user_name = author_section['login']
                project_commit.user_link = author_section['html_url']
                project_commit.user_avatar_link = author_section['avatar_url']

            project_commit.save()

    def to_json(self):
        return {
            'type': self.__class__.__name__,
            'user_name': self.user_name,
            'user_link': self.user_link,
            'user_avatar_link': self.user_avatar_link,
            'commit_date': self.commit_date,
            'commit_sha': self.commit_sha,
            'commit_title': self.commit_title,
            'branch_name': self.branch_name,
            'repo_name': self.repo_name
        }


class TrelloAction(models.Model):
    action_project = models.ForeignKey(
        Project, related_name='trello_actions', on_delete=models.CASCADE)
    member_id = models.CharField(max_length=256)  # action creator
    member_fullname = models.CharField(max_length=1024)  # full name first middle and last
    member_avatar_base_url = models.CharField(max_length=2083, blank=True)
    board_id = models.CharField(max_length=256)
    action_type = models.CharField(max_length=1024)   #action types : https://developer.atlassian.com/cloud/trello/guides/rest-api/action-types/
    action_date = models.DateTimeField(auto_now=False)
    id = models.CharField(max_length=256, primary_key = True)
    action_data = models.JSONField(null=True)

    @staticmethod
    def create(project, id, fullname, member_id, member_avatar_base_url, board_id, action_type, action_date, action_data):

        trello_action = TrelloAction()
        trello_action.action_project = project
        trello_action.member_fullname = fullname
        trello_action.member_id = member_id
        trello_action.member_avatar_base_url = member_avatar_base_url
        trello_action.board_id = board_id
        trello_action.action_type = action_type
        trello_action.action_date = action_date
        trello_action.id = id
        trello_action.action_data = action_data

        trello_action.save()

        return TrelloAction.objects.get(id=id)

    def get_avatar_url(self):
        '''
        Trello's API gives back avatar base urls (e.g. https://trello-members.s3.amazonaws.com/{id}/{hash}), but
        a size and file extension need to be added to form a valid url
        Currently, 30, 50, 170, & original are valid sizes
        '''
        avatar_size = 50
        if self.member_avatar_base_url:
            return '{base}/{size}.png'.format(base=self.member_avatar_base_url, size=avatar_size)
        else:
            return ''

    def to_json(self):
        return {
            'type': self.__class__.__name__,
            'member_fullname': self.member_fullname,
            'member_id': self.member_id,
            'board_id': self.board_id,
            'action_type': self.action_type,
            'action_date': self.action_date,
            'action_data': self.action_data,
            'member_avatar_url': self.get_avatar_url()
        }

class ProjectLink(models.Model):
    link_project = models.ForeignKey(Project, related_name='links', blank=True, null=True, on_delete=models.CASCADE)
    link_group = models.ForeignKey(Group, related_name='links', blank=True, null=True, on_delete=models.CASCADE)
    link_event = models.ForeignKey(Event, related_name='links', blank=True, null=True, on_delete=models.CASCADE)
    link_user = models.ForeignKey(Contributor, related_name='links', blank=True, null=True, on_delete=models.CASCADE)
    link_name = models.CharField(max_length=200, blank=True)
    link_url = models.CharField(max_length=2083)
    link_visibility = models.CharField(max_length=50)

    @staticmethod
    def create(owner, url, name, visibility):
        # TODO: Validate input
        link = ProjectLink()
        link.link_url = url
        link.link_name = name
        link.link_visibility = visibility

        if type(owner) is Project:
            link.link_project = owner
        elif type(owner) is Group:
            link.link_group = owner
        else:
            link.link_user = owner

        return link

    @staticmethod
    def merge_changes(owner, links):
        updated_links = list(filter(lambda link: 'id' in link, links))
        ProjectLink.remove_links_not_in_list(owner, updated_links)
        for link_json in links:
            link = ProjectLink.from_json(owner, link_json)

            if not link.id:
                ProjectLink.create(owner,
                                   link.link_url,
                                   link.link_name,
                                   link.link_visibility).save()
            else:
                existing_link = ProjectLink.objects.get(id=link.id)
                existing_link.link_name = link.link_name
                existing_link.link_url = link.link_url
                existing_link.link_visibility = link.link_visibility
                existing_link.save()

    @staticmethod
    def remove_links_not_in_list(owner, links):
        if type(owner) is Project:
            existing_links = ProjectLink.objects.filter(link_project=owner.id)
        elif type(owner) is Group:
            existing_links = ProjectLink.objects.filter(link_group=owner.id)
        else:
            existing_links = ProjectLink.objects.filter(link_user=owner.id)

        existing_link_ids = set(map(lambda link: link.id, existing_links))
        updated_link_ids = set(map(lambda link: link['id'], links))
        deleted_link_ids = list(existing_link_ids - updated_link_ids)
        for link_id in deleted_link_ids:
            ProjectLink.objects.get(id=link_id).delete()

    @staticmethod
    def from_json(owner, thumbnail_json):
        link = ProjectLink.create(owner=owner,
                                  url=thumbnail_json['linkUrl'],
                                  name=thumbnail_json['linkName'],
                                  visibility=thumbnail_json['visibility']
                                  )

        if 'id' in thumbnail_json:
            link.id = thumbnail_json['id']

        return link

    def to_json(self):
        return {
            'id': self.id,
            'linkName': self.link_name,
            'linkUrl': self.link_url,
            'visibility': self.link_visibility
        }


class TaggedPositionRole(TaggedItemBase):
    content_object = models.ForeignKey('ProjectPosition', on_delete=models.CASCADE)


class ProjectPosition(models.Model):
    position_project = models.ForeignKey(Project, related_name='positions', on_delete=models.CASCADE)
    position_role = TaggableManager(blank=False, through=TaggedPositionRole)
    position_description = models.CharField(max_length=3000, blank=True)
    description_url = models.CharField(max_length=2083, default='')
    order_number = models.PositiveIntegerField(default=0)
    is_hidden = models.BooleanField(default=False)

    def to_json(self):
        return {
            'id': self.id,
            'description': self.position_description,
            'descriptionUrl': self.description_url,
            'roleTag': Tag.hydrate_to_json(self.id, self.position_role.all().values())[0],
            'orderNumber': self.order_number,
            'isHidden': self.is_hidden
        }

    @staticmethod
    def create_from_json(project, position_json):
        position = ProjectPosition()
        position.position_project = project
        position.position_description = position_json['description']
        position.description_url = position_json['descriptionUrl']
        position.order_number = position_json['orderNumber']
        position.is_hidden = position_json['isHidden']
        position.save()

        position.position_role.add(position_json['roleTag']['tag_name'])

        return position

    @staticmethod
    def update_from_json(position, position_json):
        position.position_description = position_json['description']
        position.description_url = position_json['descriptionUrl']
        position.order_number = position_json['orderNumber']
        position.is_hidden = position_json['isHidden']
        new_role = position_json['roleTag']['tag_name']
        Tag.merge_tags_field(position.position_role, new_role)
        position.save()

    @staticmethod
    def delete_position(position):
        position.position_role.clear()
        position.delete()

    @staticmethod
    def merge_changes(project, positions):
        """
        Merge project position changes
        :param project: Project with position changes
        :param positions: Position changes
        :return: True if there were position changes
        """
        added_positions = list(filter(lambda position: 'id' not in position, positions))
        updated_positions = list(filter(lambda position: 'id' in position, positions))
        updated_positions_ids = set(map(lambda position: position['id'], updated_positions))
        existing_positions = ProjectPosition.objects.filter(position_project=project.id)
        existing_positions_ids = set(map(lambda position: position.id, existing_positions))
        existing_projects_by_id = {position.id: position for position in existing_positions}

        deleted_position_ids = list(existing_positions_ids - updated_positions_ids)

        for added_position in added_positions:
            ProjectPosition.create_from_json(project, added_position)

        for updated_position_json in updated_positions:
            ProjectPosition.update_from_json(existing_projects_by_id[updated_position_json['id']], updated_position_json)

        for deleted_position_id in deleted_position_ids:
            ProjectPosition.delete_position(existing_projects_by_id[deleted_position_id])

        return len(added_positions) > 0 or len(updated_positions) > 0 or len(deleted_position_ids) > 0


class ProjectFile(models.Model):
    # TODO: Add ForeignKey pointing to Contributor, see https://stackoverflow.com/a/20935513/6326903
    file_project = models.ForeignKey(Project, related_name='files', blank=True, null=True, on_delete=models.CASCADE)
    file_user = models.ForeignKey(Contributor, related_name='files', blank=True, null=True, on_delete=models.CASCADE)
    file_group = models.ForeignKey(Group, related_name='files', blank=True, null=True, on_delete=models.CASCADE)
    file_event = models.ForeignKey(Event, related_name='files', blank=True, null=True, on_delete=models.CASCADE)
    file_visibility = models.CharField(max_length=50)
    file_name = models.CharField(max_length=300)
    file_key = models.CharField(max_length=400)
    file_url = models.CharField(max_length=2083)
    file_type = models.CharField(max_length=50)
    file_category = models.CharField(max_length=50)

    def __str__(self):
        owner = self.get_owner() or ''
        return f'[{owner}]:{self.file_name}.{self.file_type}({self.file_category})'

    @staticmethod
    def create(owner, file_url, file_name, file_key, file_type, file_category, file_visibility):
        # TODO: Validate input
        file = ProjectFile()
        file.file_url = file_url
        file.file_name = file_name
        file.file_key = file_key
        file.file_type = file_type
        file.file_category = file_category
        file.file_visibility = file_visibility

        if type(owner) is Project:
            file.file_project = owner
        elif type(owner) is Group:
            file.file_group = owner
        elif type(owner) is Event:
            file.file_event = owner
        else:
            file.file_user = owner

        return file

    @staticmethod
    def merge_changes(owner, files):
        # Add new files
        added_files = filter(lambda file: 'id' not in file, files)

        if type(owner) is Project:
            old_files = list(ProjectFile.objects.filter(file_project=owner.id, file_category=FileCategory.ETC.value)
                             .values())
        elif type(owner) is Group:
            old_files = list(ProjectFile.objects.filter(file_group=owner.id, file_category=FileCategory.ETC.value)
                             .values())
        elif type(owner) is Event:
            old_files = list(ProjectFile.objects.filter(file_event=owner.id, file_category=FileCategory.ETC.value)
                             .values())
        else:
            old_files = list(ProjectFile.objects.filter(file_user=owner.id, file_category=FileCategory.ETC.value)
                             .values())

        for file in added_files:
            ProjectFile.from_json(owner=owner, file_category=FileCategory.ETC, file_json=file).save()

        # Remove files that were deleted
        old_file_ids = set(map(lambda file: file['id'], old_files))
        updated_files = filter(lambda file: 'id' in file, files)
        updated_file_ids = set(map(lambda file: file['id'], updated_files))
        removed_file_ids = list(old_file_ids - updated_file_ids)
        for file_id in removed_file_ids:
            ProjectFile.objects.get(id=file_id).delete()

    @staticmethod
    def replace_single_file(owner, file_category, file_json, new_file_category=None):
        """
        :param owner: Owner model instace of the file
        :param file_category: File type
        :param file_json: File metadata
        :param new_file_category: New file type
        :return: True if the file was changed
        """
        new_file_category = new_file_category or file_category
        if type(owner) is Project:
            existing_file = ProjectFile.objects.filter(file_project=owner.id, file_category=file_category.value).first()
        elif type(owner) is Group:
            existing_file = ProjectFile.objects.filter(file_group=owner.id, file_category=file_category.value).first()
        elif type(owner) is Event:
            existing_file = ProjectFile.objects.filter(file_event=owner.id, file_category=file_category.value).first()
        else:
            existing_file = ProjectFile.objects.filter(file_user=owner.id, file_category=file_category.value).first()

        is_empty_field = is_json_field_empty(file_json)
        file_changed = False
        if is_empty_field and existing_file:
            # Remove existing file
            existing_file.delete()
            file_changed = True
        elif not is_empty_field:
            if not existing_file:
                # Add new file
                thumbnail = ProjectFile.from_json(owner, new_file_category, file_json)
                thumbnail.save()
                file_changed = True
            elif file_json['key'] != existing_file.file_key:
                # Replace existing file
                thumbnail = ProjectFile.from_json(owner, new_file_category, file_json)
                thumbnail.save()
                existing_file.delete()
                file_changed = True
        return file_changed

    def get_owner(self):
        return self.file_project or self.file_group or self.file_event or self.file_user

    @staticmethod
    def from_json(owner, file_category, file_json):
        file_name_parts = file_json['fileName'].split('.')
        file_name = "".join(file_name_parts[0])
        # Filename without file type
        if len(file_name_parts) == 1:
            file_type = ""
        else:
            file_type = file_name_parts[-1]

        return ProjectFile.create(owner=owner,
                                  file_url=file_json['publicUrl'],
                                  file_name=file_name,
                                  file_key=file_json['key'],
                                  file_type=file_type,
                                  file_category=file_category.value,
                                  file_visibility=file_json['visibility'])

    def to_json(self):
        return {
            'key': self.file_key,
            'fileName': self.file_name + '.' + self.file_type,
            'fileCategory': self.file_category,
            'publicUrl': self.file_url,
            'visibility': self.file_visibility
        }


class ProjectFavorite(models.Model):
    link_project = models.ForeignKey(Project, related_name='favorites', on_delete=models.CASCADE)
    link_user = models.ForeignKey(Contributor, related_name='favorites', on_delete=models.CASCADE)

    @staticmethod
    def create(user, project):
        fav = ProjectFavorite.objects.create(link_project=project, link_user=user)
        fav.save()
        return fav

    @staticmethod
    def get_for_user(user):
        return Project.objects.filter(favorites__link_user=user)

    @staticmethod
    def get_for_project(project, user=None):
        if user is not None:
            return ProjectFavorite.objects.filter(link_project=project, link_user=user)
        else:
            return ProjectFavorite.objects.filter(link_project=project)


class FileCategory(Enum):
    THUMBNAIL = 'THUMBNAIL'
    THUMBNAIL_ERROR = 'THUMBNAIL_ERROR'
    RESUME = 'RESUME'
    ETC = 'ETC'


class UserAlert(models.Model):
    email = models.EmailField()
    filters = models.CharField(max_length=2083)
    country = models.CharField(max_length=2)
    postal_code = models.CharField(max_length=20)

    def __str__(self):
        return str(self.email)

    @staticmethod
    def create_or_update(email, filters, country, postal_code):
        alert = UserAlert.objects.filter(email=email).first()
        if alert is None:
            alert = UserAlert()
            alert.email = email
        alert.filters = filters
        alert.country = country
        alert.postal_code = postal_code
        alert.save()


class TaggedVolunteerRole(TaggedItemBase):
    content_object = models.ForeignKey('VolunteerRelation', on_delete=models.CASCADE)


class VolunteerRelation(Archived):
    project = models.ForeignKey(Project, related_name='volunteer_relations', on_delete=models.CASCADE)
    volunteer = models.ForeignKey(Contributor, related_name='volunteer_relations', on_delete=models.CASCADE)
    role = TaggableManager(blank=True, through=TaggedVolunteerRole)
    role.remote_field.related_name = "+"
    application_text = models.CharField(max_length=10000, blank=True)
    is_approved = models.BooleanField(default=False)
    is_co_owner = models.BooleanField(default=False)
    is_team_leader = models.BooleanField(default=False)
    projected_end_date = models.DateTimeField(auto_now=False, null=True, blank=True)
    application_date = models.DateTimeField(auto_now=False, null=False, default=timezone.now)
    approved_date = models.DateTimeField(auto_now=False, null=True, blank=True)
    last_reminder_date = models.DateTimeField(auto_now=False, null=True, blank=True)
    reminder_count = models.IntegerField(default=0)
    re_enrolled_last_date = models.DateTimeField(auto_now=False, null=True, blank=True)
    re_enroll_last_reminder_date = models.DateTimeField(auto_now=False, null=True, blank=True)
    re_enroll_reminder_count = models.IntegerField(default=0)

    def __str__(self):
        return 'Project: ' + str(self.project.project_name) + ', User: ' + str(self.volunteer.email)

    def to_json(self):
        volunteer = self.volunteer

        volunteer_json = {
            'application_id': self.id,
            'user': volunteer.hydrate_to_tile_json(),
            'application_text': self.application_text,
            'application_date': self.application_date.__str__(),
            'platform_date_joined': volunteer.date_joined.__str__(),
            'roleTag': Tag.hydrate_to_json(volunteer.id, self.role.all().values())[0],
            'isApproved': self.is_approved,
            'isCoOwner': self.is_co_owner,
            'isTeamLeader': self.is_team_leader,
            'isUpForRenewal': self.is_up_for_renewal(),
            'projectedEndDate': self.projected_end_date.__str__()
        }

        return volunteer_json

    def hydrate_project_volunteer_info(self):
        volunteer_json = self.to_json()
        project_json = self.project.hydrate_to_list_json()
        return merge_dicts(project_json, volunteer_json)

    def is_up_for_renewal(self, now=None):
        now = now or timezone.now()
        return (self.projected_end_date - now) < settings.VOLUNTEER_REMINDER_OVERALL_PERIOD

    def approve(self):
        self.save()
        salesforce_volunteer.save()

    @staticmethod
    def create(project, volunteer, projected_end_date, role, application_text):
        relation = VolunteerRelation()
        relation.project = project
        relation.volunteer = volunteer
        relation.projected_end_date = projected_end_date
        relation.application_text = application_text
        relation.is_co_owner = False
        relation.save()
        relation.role.add(role)
        return relation

    @staticmethod
    def get_by_user(user):
        return VolunteerRelation.objects.filter(volunteer=user.id)

    @staticmethod
    def get_by_project(project, active=True):
        return VolunteerRelation.objects.filter(project_id=project.id, is_approved=active, deleted=not active)


class TaggedCategory(TaggedItemBase):
    content_object = models.ForeignKey('Testimonial', on_delete=models.CASCADE)


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    avatar_url = models.CharField(max_length=2083, blank=True)
    title = models.CharField(max_length=100, blank=True)
    text = models.CharField(max_length=2000)
    source = models.CharField(max_length=2000, blank=True)
    categories = TaggableManager(blank=True, through=TaggedCategory)
    categories.remote_field.related_name = 'category_testimonials'
    priority = models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def to_json(self):
        return {
            'name': self.name,
            'avatar_url': self.avatar_url,
            'title': self.title,
            'text': self.text,
            'source': self.source
        }
