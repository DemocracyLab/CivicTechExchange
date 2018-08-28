from django.db import models


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
        tag = Tag.objects.filter(tag_name=name).first()
        if tag is None:
            print("ERROR: Could not find tag", name)
        return tag

    @staticmethod
    def hydrate_to_json(project_id, tag_entries):
        # TODO: Use in-memory cache for tags
        # TODO: Remove project id from this if we don't end up using it
        tags = map(lambda tag_slug: Tag.get_by_name(tag_slug['slug']), tag_entries)
        existing_tags = filter(lambda tag: tag is not None, tags)
        hydrated_tags = list(map(lambda tag: Tag.hydrate_tag_model(tag), existing_tags))
        return hydrated_tags

    @staticmethod
    def hydrate_tag_model(tag):
        return {
            'display_name': tag.display_name,
            'tag_name': tag.tag_name,
            'caption': tag.caption,
            'category': tag.category,
            'subcategory': tag.subcategory,
            'parent': tag.parent}

    @staticmethod
    def merge_tags_field(tags_field, tag_entries):
        tag_entries = tag_entries or ""
        tag_entry_slugs = set(tag_entries.split(','))
        existing_tag_slugs = set(tags_field.slugs())

        tags_to_add = list(tag_entry_slugs - existing_tag_slugs)
        for tag in tags_to_add:
            tags_field.add(tag)

        tags_to_remove = list(existing_tag_slugs - tag_entry_slugs)
        for tag in tags_to_remove:
            tags_field.remove(tag)
