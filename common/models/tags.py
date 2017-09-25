from django.db import models
import sys
import os
import csv

# Create your models here.
class Tag(models.Model):
    tag_name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=200)
    caption = models.CharField(max_length=500, blank=True)
    category = models.CharField(max_length=200)
    subcategory = models.CharField(max_length=200, blank=True)
    parent = models.CharField(max_length=100, blank=True)

def import_tags_from_csv(apps, schema):
    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, 'Tag_definitions.csv')
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        try:
            #skip header row
            next(reader)
            for row in reader:
                print(row)
                tag = Tag(tag_name=row[0],
                          display_name=row[1],
                          caption=row[2],
                          category=row[3],
                          subcategory=row[4],
                          parent=row[5]
                          )
                tag.save()
        except csv.Error as e:
            sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))