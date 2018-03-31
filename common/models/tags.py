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

    def __str__(self):
        prefix = self.category
        if self.subcategory:
            prefix += '->' + self.subcategory
        return prefix + '->' + self.tag_name

    @staticmethod
    def get_by_name(name):
        # TODO: Get from in-memory cache
        return Tag.objects.filter(tag_name=name).first()

    @staticmethod
    def hydrate_to_json(tag_entries):
        # TODO: Use in-memory cache for tags
        tags = list(map(lambda tag_slug: Tag.objects.filter(tag_name=tag_slug['slug']).first(), tag_entries))
        hydrated_tags = list(map(lambda tag: {'label': tag.display_name, 'value': tag.tag_name}, tags))
        return hydrated_tags

    @staticmethod
    def merge_tags_field(tags_field, tag_entries):
        tag_entry_slugs = set(tag_entries.split(','))
        existing_tag_slugs = set(tags_field.slugs())

        tags_to_add = list(tag_entry_slugs - existing_tag_slugs)
        for tag in tags_to_add:
            tags_field.add(tag)

        tags_to_remove = list(existing_tag_slugs - tag_entry_slugs)
        for tag in tags_to_remove:
            tags_field.remove(tag)


def get_tags_by_category(categoryName):
    return Tag.objects.filter(category__contains=categoryName)


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
