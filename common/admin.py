from django.contrib import admin

from .models import Tag

tag_text_fields = ['tag_name', 'display_name', 'caption', 'category', 'subcategory', 'parent']
class TagAdmin(admin.ModelAdmin):
    list_display = tuple(tag_text_fields)
    search_fields = tag_text_fields
    list_filter = ('category', 'subcategory')

admin.site.register(Tag, TagAdmin)