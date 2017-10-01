from django.db import models
from democracylab.models import Contributor

# Create your models here.
class Project(models.Model):
    project_name = models.CharField(max_length=200)
    project_creator = models.ForeignKey(Contributor)
    project_url = models.CharField(max_length=200, blank=True)
    project_description = models.CharField(max_length=1000, blank=True)
    project_tags = models.CharField(max_length=1000, blank=True)
