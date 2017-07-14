from django.db import models

# Create your models here.
class Project(models.Model):
    project_name = models.CharField(max_length=200)
    project_url = models.CharField(max_length=200)
    project_description = models.CharField(max_length=1000)
    project_tags = models.CharField(max_length=1000)