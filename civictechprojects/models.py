from django.conf import settings
from django.db import models
from django.utils import timezone
from enum import Enum
from democracylab.models import Contributor
from common.models.tags import Tag
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase
from common.helpers.form_helpers import is_json_field_empty
from common.helpers.dictionaries import merge_dicts


# Without the following classes, the following error occurs:
#
#   ValueError: You can't have two TaggableManagers with the same
#   through model.
#
# By default, the `through` field is the same across both TaggableManagers
# because when the parameter is omitted, identical defaults are provided.
# See: https://django-taggit.readthedocs.io/en/latest/api.html#TaggableManager
class TaggedIssueAreas(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class TaggedStage(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class TaggedTechnologies(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class TaggedOrganization(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class TaggedOrganizationType(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class ArchiveManager(models.Manager):
    def get_queryset(self):
        return super(ArchiveManager, self).get_queryset().filter(deleted=True)


class DefaultManager(models.Manager):
    def get_queryset(self):
        return super(DefaultManager, self).get_queryset().filter(deleted=False)

# This base class adds delete functionality to models using a flag,  and filters deleted items out of the default result set 
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
    # TODO: Change related name to 'created_projects' or something similar
    project_creator = models.ForeignKey(Contributor, related_name='creator')
    project_description = models.CharField(max_length=4000, blank=True)
    project_description_solution = models.CharField(max_length=4000, blank=True)
    project_description_actions = models.CharField(max_length=4000, blank=True)
    project_short_description = models.CharField(max_length=140, blank=True)
    project_issue_area = TaggableManager(blank=True, through=TaggedIssueAreas)
    project_issue_area.remote_field.related_name = "+"
    project_stage = TaggableManager(blank=True, through=TaggedStage)
    project_stage.remote_field.related_name = "+"
    project_technologies = TaggableManager(blank=True, through=TaggedTechnologies)
    project_technologies.remote_field.related_name = "+"
    project_organization = TaggableManager(blank=True, through=TaggedOrganization)
    project_organization.remote_field.related_name = "+"
    project_organization_type = TaggableManager(blank=True, through=TaggedOrganizationType)
    project_organization_type.remote_field.related_name = "+"
    project_location = models.CharField(max_length=200, blank=True)
    project_name = models.CharField(max_length=200)
    project_url = models.CharField(max_length=2083, blank=True)
    project_date_created = models.DateTimeField(null=True)
    project_date_modified = models.DateTimeField(auto_now_add=True, null=True)
    is_searchable = models.BooleanField(default=False)
    is_created = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id) + ':' + str(self.project_name)

    def delete(self):
        self.is_searchable=False
        super().delete()

    def all_owners(self):
        owners = [self.project_creator]
        project_volunteers = VolunteerRelation.objects.filter(project=self.id)
        project_co_owners = filter(lambda pv: pv.is_co_owner, project_volunteers)

        return owners + list(map(lambda pv: pv.volunteer, project_co_owners))

    def hydrate_to_json(self):
        files = ProjectFile.objects.filter(file_project=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))
        links = ProjectLink.objects.filter(link_project=self.id)
        positions = ProjectPosition.objects.filter(position_project=self.id)
        volunteers = VolunteerRelation.objects.filter(project=self.id)
        commits = ProjectCommit.objects.filter(commit_project=self.id).order_by('-commit_date')[:10]

        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'project_claimed': not self.project_creator.is_admin_contributor(),
            'project_approved': self.is_searchable,
            'project_description': self.project_description,
            'project_description_solution': self.project_description_solution,
            'project_description_actions': self.project_description_actions,
            'project_short_description': self.project_short_description,
            'project_url': self.project_url,
            'project_location': self.project_location,
            'project_organization': Tag.hydrate_to_json(self.id, list(self.project_organization.all().values())),
            'project_organization_type': Tag.hydrate_to_json(self.id, list(self.project_organization_type.all().values())),
            'project_issue_area': Tag.hydrate_to_json(self.id, list(self.project_issue_area.all().values())),
            'project_stage': Tag.hydrate_to_json(self.id, list(self.project_stage.all().values())),
            'project_technologies': Tag.hydrate_to_json(self.id, list(self.project_technologies.all().values())),
            'project_positions': list(map(lambda position: position.to_json(), positions)),
            'project_files': list(map(lambda file: file.to_json(), other_files)),
            'project_links': list(map(lambda link: link.to_json(), links)),
            'project_commits': list(map(lambda commit: commit.to_json(), commits)),
            'project_owners': [self.project_creator.hydrate_to_tile_json()],
            'project_volunteers': list(map(lambda volunteer: volunteer.to_json(), volunteers)),
            'project_date_modified': self.project_date_modified.__str__()
        }

        if len(thumbnail_files) > 0:
            project['project_thumbnail'] = thumbnail_files[0].to_json()

        return project

    def hydrate_to_tile_json(self):
        files = ProjectFile.objects.filter(file_project=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        positions = ProjectPosition.objects.filter(position_project=self.id)

        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'project_description': self.project_short_description if self.project_short_description else self.project_description,
            'project_url': self.project_url,
            'project_location': self.project_location,
            'project_issue_area': Tag.hydrate_to_json(self.id, list(self.project_issue_area.all().values())),
            'project_stage': Tag.hydrate_to_json(self.id, list(self.project_stage.all().values())),
            'project_positions': list(map(lambda position: position.to_json(), positions)),
            'project_date_modified': self.project_date_modified.__str__()
        }

        if len(thumbnail_files) > 0:
            project['project_thumbnail'] = thumbnail_files[0].to_json()

        return project

    def hydrate_to_list_json(self):
        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'isApproved': self.is_searchable,
            'isCreated': self.is_created
        }

        return project

    def update_timestamp(self, time=None):
        self.project_date_modified = time or timezone.now()
        self.save()


class ProjectCommit(models.Model):
    commit_project = models.ForeignKey(Project, related_name='commits', blank=True, null=True)
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
        existing_commit = ProjectCommit.objects.filter(commit_sha=commit_sha)
        if existing_commit.count() == 0:
            project_commit = ProjectCommit()
            project_commit.commit_project = project
            project_commit.repo_name = repo_name
            project_commit.branch_name = branch_name
            project_commit.commit_sha = commit_sha

            commit_section = github_json['commit']
            project_commit.commit_title = commit_section['message']
            project_commit.commit_date = commit_section['author']['date']

            author_section = github_json['author']
            project_commit.user_name = author_section['login']
            project_commit.user_link = author_section['html_url']
            project_commit.user_avatar_link = author_section['avatar_url']
            project_commit.save()

    def to_json(self):
        return {
            'user_name': self.user_name,
            'user_link': self.user_link,
            'user_avatar_link': self.user_avatar_link,
            'commit_date': self.commit_date,
            'commit_sha': self.commit_sha,
            'commit_title': self.commit_title,
            'branch_name': self.branch_name,
            'repo_name': self.repo_name
        }


class ProjectLink(models.Model):
    link_project = models.ForeignKey(Project, related_name='links', blank=True, null=True)
    link_user = models.ForeignKey(Contributor, related_name='links', blank=True, null=True)
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
    content_object = models.ForeignKey('ProjectPosition')


class ProjectPosition(models.Model):
    position_project = models.ForeignKey(Project, related_name='positions')
    position_role = TaggableManager(blank=False, through=TaggedPositionRole)
    position_description = models.CharField(max_length=3000, blank=True)
    description_url = models.CharField(max_length=2083, default='')

    def to_json(self):
        return {
            'id': self.id,
            'description': self.position_description,
            'descriptionUrl': self.description_url,
            'roleTag': Tag.hydrate_to_json(self.id, self.position_role.all().values())[0]
        }

    @staticmethod
    def create_from_json(project, position_json):
        position = ProjectPosition()
        position.position_project = project
        position.position_description = position_json['description']
        position.description_url = position_json['descriptionUrl']
        position.save()

        position.position_role.add(position_json['roleTag']['tag_name'])

        return position

    @staticmethod
    def update_from_json(position, position_json):
        position.position_description = position_json['description']
        position.description_url = position_json['descriptionUrl']
        new_role = position_json['roleTag']['tag_name']
        Tag.merge_tags_field(position.position_role, new_role)
        position.save()

    @staticmethod
    def delete_position(position):
        position.position_role.clear()
        position.delete()

    @staticmethod
    def merge_changes(project, positions):
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


class ProjectFile(models.Model):
    # TODO: Add ForeignKey pointing to Contributor, see https://stackoverflow.com/a/20935513/6326903
    file_project = models.ForeignKey(Project, related_name='files', blank=True, null=True)
    file_user = models.ForeignKey(Contributor, related_name='files', blank=True, null=True)
    file_visibility = models.CharField(max_length=50)
    file_name = models.CharField(max_length=150)
    file_key = models.CharField(max_length=200)
    file_url = models.CharField(max_length=2083)
    file_type = models.CharField(max_length=50)
    file_category = models.CharField(max_length=50)

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
    def replace_single_file(owner, file_category, file_json):
        if type(owner) is Project:
            existing_file = ProjectFile.objects.filter(file_project=owner.id, file_category=file_category.value).first()
        else:
            existing_file = ProjectFile.objects.filter(file_user=owner.id, file_category=file_category.value).first()

        is_empty_field = is_json_field_empty(file_json)
        if is_empty_field and existing_file:
            # Remove existing file
            existing_file.delete()
        elif not is_empty_field:
            if not existing_file:
                # Add new file
                thumbnail = ProjectFile.from_json(owner, file_category, file_json)
                thumbnail.save()
            elif file_json['key'] != existing_file.file_key:
                # Replace existing file
                thumbnail = ProjectFile.from_json(owner, file_category, file_json)
                thumbnail.save()
                existing_file.delete()

    @staticmethod
    def from_json(owner, file_category, file_json):
        file_name_parts = file_json['fileName'].split('.')
        file_name = "".join(file_name_parts[:-1])
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


class FileCategory(Enum):
    THUMBNAIL = 'THUMBNAIL'
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
    content_object = models.ForeignKey('VolunteerRelation')


class VolunteerRelation(Archived):
    project = models.ForeignKey(Project, related_name='volunteer_relations')
    volunteer = models.ForeignKey(Contributor, related_name='volunteer_relations')
    role = TaggableManager(blank=True, through=TaggedVolunteerRole)
    role.remote_field.related_name = "+"
    application_text = models.CharField(max_length=10000, blank=True)
    is_approved = models.BooleanField(default=False)
    is_co_owner = models.BooleanField(default=False)
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
            'roleTag': Tag.hydrate_to_json(volunteer.id, self.role.all().values())[0],
            'isApproved': self.is_approved,
            'isCoOwner': self.is_co_owner,
            'isUpForRenewal': self.is_up_for_renewal(),
            'projectedEndDate': self.projected_end_date.__str__()
        }

        return volunteer_json

    def hydrate_project_volunteer_info(self):
        volunteer_json = self.to_json()
        project_json = self.project.hydrate_to_list_json()
        return merge_dicts(volunteer_json, project_json)

    def is_up_for_renewal(self, now=None):
        now = now or timezone.now()
        return (self.projected_end_date - now) < settings.VOLUNTEER_REMINDER_OVERALL_PERIOD

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
