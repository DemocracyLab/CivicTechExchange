from django.contrib import admin

from .models import Contributor

contributor_text_fields = ['email', 'first_name', 'last_name', 'about_me', 'country', 'postal_code', 'phone_primary', 'about_me', 'uuid', 'qiqo_uuid']
contributor_filter_fields = ('email_verified',)
class ContributorAdmin(admin.ModelAdmin):
    list_display = tuple(contributor_text_fields) + contributor_filter_fields
    search_fields = contributor_text_fields
    list_filter = contributor_filter_fields
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            obj.update_linked_items()
        

admin.site.register(Contributor, ContributorAdmin)