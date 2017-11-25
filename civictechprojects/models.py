from django.db import models
from democracylab.models import Contributor

from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase


class TaggedIssueAreas(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class TaggedTag(TaggedItemBase):
    content_object = models.ForeignKey('Project')


class Project(models.Model):
    project_creator = models.ForeignKey(Contributor)
    project_description = models.CharField(max_length=1000, blank=True)
    project_issue_area = TaggableManager(blank=True, through=TaggedIssueAreas)
    project_issue_area.rel.related_name = "+"
    project_location = models.CharField(max_length=200)
    project_name = models.CharField(max_length=200)
    project_tags = TaggableManager(blank=True, through=TaggedTag)
    project_tags.rel.related_name = "+"
    project_url = models.CharField(max_length=200, blank=True)
