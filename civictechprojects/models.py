from django.db import models
from democracylab.models import Contributor

from taggit.managers import TaggableManager


class Project(models.Model):
    project_creator = models.ForeignKey(Contributor)
    project_description = models.CharField(max_length=1000, blank=True)
    project_issue_area = models.CharField(max_length=200)
    project_location = models.CharField(max_length=200)
    project_name = models.CharField(max_length=200)
    project_tags = TaggableManager(blank=True)
    project_url = models.CharField(max_length=200, blank=True)
