from django.db import models
from enum import Enum
from democracylab.models import Contributor
from common.models.tags import Tag
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase


# Without the following two classes, the following error occurs:
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


class Project(models.Model):
    project_volunteers = models.ManyToManyField(
        Contributor,
        related_name='volunteers',
        blank=True
    )
    # TODO: Change related name to 'created_projects' or something similar
    project_creator = models.ForeignKey(Contributor, related_name='creator')
    project_description = models.CharField(max_length=3000, blank=True)
    project_issue_area = TaggableManager(blank=True, through=TaggedIssueAreas)
    project_issue_area.remote_field.related_name = "+"
    project_stage = TaggableManager(blank=True, through=TaggedStage)
    project_stage.remote_field.related_name = "+"
    project_technologies = TaggableManager(blank=True, through=TaggedTechnologies)
    project_technologies.remote_field.related_name = "+"
    project_organization = TaggableManager(blank=True, through=TaggedOrganization)
    project_organization.remote_field.related_name = "+"
    project_location = models.CharField(max_length=200)
    project_name = models.CharField(max_length=200)
    project_url = models.CharField(max_length=2083, blank=True)
    project_links = models.CharField(max_length=5000, blank=True)
    is_searchable = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id) + ':' + str(self.project_name)

    def hydrate_to_json(self):
        files = ProjectFile.objects.filter(file_project=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))
        links = ProjectLink.objects.filter(link_project=self.id)
        positions = ProjectPosition.objects.filter(position_project=self.id)

        project = {
            'project_id': self.id,
            'project_name': self.project_name,
            'project_creator': self.project_creator.id,
            'project_claimed': not self.project_creator.is_admin_contributor(),
            'project_description': self.project_description,
            'project_url': self.project_url,
            'project_location': self.project_location,
            'project_organization': Tag.hydrate_to_json(self.id, list(self.project_organization.all().values())),
            'project_issue_area': Tag.hydrate_to_json(self.id, list(self.project_issue_area.all().values())),
            'project_stage': Tag.hydrate_to_json(self.id, list(self.project_stage.all().values())),
            'project_technologies': Tag.hydrate_to_json(self.id, list(self.project_technologies.all().values())),
            'project_positions': list(map(lambda position: position.to_json(), positions)),
            'project_files': list(map(lambda file: file.to_json(), other_files)),
            'project_links': list(map(lambda link: link.to_json(), links))
        }

        if len(thumbnail_files) > 0:
            project['project_thumbnail'] = thumbnail_files[0].to_json()

        return project


class ProjectLink(models.Model):
    link_project = models.ForeignKey(Project, related_name='links')
    link_name = models.CharField(max_length=200, blank=True)
    link_url = models.CharField(max_length=2083)
    link_visibility = models.CharField(max_length=50)

    @staticmethod
    def create(project, url, name, visibility):
        # TODO: Validate input
        link = ProjectLink()
        link.link_project = project
        link.link_url = url
        link.link_name = name
        link.link_visibility = visibility
        return link

    @staticmethod
    def merge_changes(project, links):
        updated_links = list(filter(lambda link: 'id' in link, links))
        ProjectLink.remove_links_not_in_list(project, updated_links)
        for link_json in links:
            link = ProjectLink.from_json(project, link_json)

            if not link.id:
                ProjectLink.create(project,
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
    def remove_links_not_in_list(project, links):
        existing_links = ProjectLink.objects.filter(link_project=project.id)
        existing_link_ids = set(map(lambda link: link.id, existing_links))
        updated_link_ids = set(map(lambda link: link['id'], links))
        deleted_link_ids = list(existing_link_ids - updated_link_ids)
        for link_id in deleted_link_ids:
            ProjectLink.objects.get(id=link_id).delete()

    @staticmethod
    def from_json(project, thumbnail_json):
        link = ProjectLink.create(project=project,
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
        position.description_url = position_json['descriptionUrl']
        position.save()

        position.position_role.add(position_json['roleTag']['tag_name'])

        return position

    @staticmethod
    def update_from_json(position, position_json):
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
    file_project = models.ForeignKey(Project, related_name='files')
    file_visibility = models.CharField(max_length=50)
    file_name = models.CharField(max_length=200)
    file_key = models.CharField(max_length=200)
    file_url = models.CharField(max_length=2083)
    file_type = models.CharField(max_length=50)
    file_category = models.CharField(max_length=50)

    @staticmethod
    def create(project, file_url, file_name, file_key, file_type, file_category, file_visibility):
        # TODO: Validate input
        file = ProjectFile()
        file.file_project = project
        file.file_url = file_url
        file.file_name = file_name
        file.file_key = file_key
        file.file_type = file_type
        file.file_category = file_category
        file.file_visibility = file_visibility
        return file

    @staticmethod
    def merge_changes(project, files):
        # Add new files
        added_files = filter(lambda file: 'id' not in file, files)
        old_files = list(ProjectFile.objects.filter(file_project=project.id, file_category=FileCategory.ETC.value)
                         .values())

        for file in added_files:
            ProjectFile.from_json(project=project, file_category=FileCategory.ETC, file_json=file).save()

        # Remove files that were deleted
        old_file_ids = set(map(lambda file: file['id'], old_files))
        updated_files = filter(lambda file: 'id' in file, files)
        updated_file_ids = set(map(lambda file: file['id'], updated_files))
        removed_file_ids = list(old_file_ids - updated_file_ids)
        for file_id in removed_file_ids:
            ProjectFile.objects.get(id=file_id).delete()

    @staticmethod
    def remove_links_not_in_list(project, links):
        existing_links = ProjectLink.objects.filter(link_project=project.id)
        existing_link_ids = set(map(lambda link: link.id, existing_links))
        updated_link_ids = set(map(lambda link: link['id'], links))
        deleted_link_ids = list(existing_link_ids - updated_link_ids)
        for link_id in deleted_link_ids:
            ProjectLink.objects.get(id=link_id).delete()

    @staticmethod
    def from_json(project, file_category, file_json):
        file_name_parts = file_json['fileName'].split('.')
        file_name = "".join(file_name_parts[:-1])
        file_type = file_name_parts[-1]

        return ProjectFile.create(project=project,
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
            'publicUrl': self.file_url,
            'visibility': self.file_visibility
        }


class FileCategory(Enum):
    THUMBNAIL = 'THUMBNAIL'
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
