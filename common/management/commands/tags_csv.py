from django.core.management.base import BaseCommand
from common.models.tags import Tag

class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Canonical Name(lowercase + '-'),Display Name(shown on UI),Caption (Hover-over text in UI),Category,Subcategory,Parent (Use Canonical Name)")
        for tag in Tag.objects.all():
            fields = (tag.tag_name,tag.display_name,tag.caption,tag.category,tag.subcategory,tag.parent)
            print(','.join(fields))
