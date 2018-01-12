from django.db import models
from enum import Enum
from democracylab.models import Contributor

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


class TaggedTag(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class Project(models.Model):
    project_volunteers = models.ManyToManyField(
        Contributor,
        related_name='volunteers',
    )
    # TODO: Change related name to 'created_projects' or something similar
    project_creator = models.ForeignKey(Contributor, related_name='creator')
    project_description = models.CharField(max_length=3000, blank=True)
    project_issue_area = TaggableManager(blank=True, through=TaggedIssueAreas)
    project_issue_area.remote_field.related_name = "+"
    project_location = models.CharField(max_length=200)
    project_name = models.CharField(max_length=200)
    project_tags = TaggableManager(blank=True, through=TaggedTag)
    project_tags.remote_field.related_name = "+"
    project_url = models.CharField(max_length=200, blank=True)
    project_links = models.CharField(max_length=5000, blank=True)

    def to_json(self):
        project = {
            'project_name': self.project_name,
            'project_description': self.project_description,
            'project_url': self.project_url
        }

        files = ProjectFile.objects.filter(file_project=self.id)
        thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
        other_files = list(files.filter(file_category=FileCategory.ETC.value))
        if len(thumbnail_files) > 0:
            project['project_thumbnail'] = thumbnail_files[0].to_json()
        links = ProjectLink.objects.filter(link_project=self.id)
        return {
            'project': project,
            'files': list(map(lambda file: file.to_json(), other_files)),
            'links': list(map(lambda link: link.to_json(), links))
        }


class ProjectLink(models.Model):
    link_project = models.ForeignKey(Project, related_name='links')
    link_name = models.CharField(max_length=200, blank=True)
    link_url = models.CharField(max_length=2000)
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
    def from_json(project, thumbnail_json):
        return ProjectLink.create(project=project,
                                  url=thumbnail_json['linkUrl'],
                                  name=thumbnail_json['linkName'],
                                  visibility=thumbnail_json['visibility']
                                  )

    def to_json(self):
        return {
            'linkName': self.link_name,
            'linkUrl': self.link_url,
            'visibility': self.link_visibility
        }


class ProjectFile(models.Model):
    file_project = models.ForeignKey(Project, related_name='files')
    file_visibility = models.CharField(max_length=50)
    file_name = models.CharField(max_length=200)
    file_key = models.CharField(max_length=200)
    file_url = models.CharField(max_length=2000)
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
