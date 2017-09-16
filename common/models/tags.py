from django.db import models

# Create your models here.
class Tag(models.Model):
    tag_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=200)
    caption = models.CharField(max_length=500)
    category = models.CharField(max_length=200)
    subcategory = models.CharField(max_length=200)
    parent = models.CharField(max_length=100)