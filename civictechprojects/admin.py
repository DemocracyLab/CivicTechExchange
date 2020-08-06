from django.contrib import admin

from .models import Project, Group, Event, ProjectRelationship, UserAlert, VolunteerRelation, ProjectCommit

project_text_fields = ['project_name', 'project_description', 'project_description_solution', 'project_description_actions', 'project_short_description', 'project_location', 'project_country', 'project_state', 'project_city', 'project_url']
project_filter_fields = ('project_date_created', 'project_date_modified', 'is_searchable', 'is_created')
class ProjectAdmin(admin.ModelAdmin):
    list_display =  tuple(project_text_fields) + ('project_creator',) + project_filter_fields
    search_fields = project_text_fields + ['project_creator__email']
    list_filter = project_filter_fields

project_relationship_filter_fields = ('project_initiated', 'is_approved')
class ProjectRelationshipAdmin(admin.ModelAdmin):
    list_display = ('relationship_project', 'relationship_group', 'relationship_event', 'introduction_text') + project_relationship_filter_fields
    search_fields = ['relationship_project__project_name', 'relationship_group__group_name', 'relationship_event__event_name', 'introduction_text']
    list_filter = project_relationship_filter_fields

group_text_fields = ['group_name', 'group_description', 'group_url', 'group_location', 'group_country', 'group_state', 'group_city', 'group_short_description']
group_filter_fields = ('group_date_created', 'group_date_modified', 'is_searchable', 'is_created')
class GroupAdmin(admin.ModelAdmin):
    list_display = tuple(group_text_fields) + ('group_creator',) + group_filter_fields
    search_fields = group_text_fields + ['group_creator__email']
    list_filter = group_filter_fields

event_text_fields = ['event_name', 'event_agenda', 'event_description','event_location', 'event_rsvp_url', 'event_live_id', 'event_short_description']
event_filter_fields = ('event_date_created', 'event_date_end', 'event_date_modified', 'event_date_start', 'is_searchable', 'is_created')
class EventAdmin(admin.ModelAdmin):
    list_display = tuple(event_text_fields) + ('event_creator',) + event_filter_fields
    search_fields = event_text_fields + ['event_creator__email']
    list_filter = event_filter_fields

user_alert_text_fields = ['email', 'filters', 'country', 'postal_code']
class UserAlertAdmin(admin.ModelAdmin):
    list_display = tuple(user_alert_text_fields)
    search_fields = user_alert_text_fields

volunteer_relation_filter_fields = ('is_approved', 'is_co_owner', 'projected_end_date', 'application_date', 'approved_date', 'last_reminder_date', 'reminder_count', 're_enrolled_last_date', 're_enroll_last_reminder_date', 're_enroll_reminder_count')
class VolunteerRelationAdmin(admin.ModelAdmin):
    list_display = ('volunteer', 'project', 'application_text') + volunteer_relation_filter_fields
    search_fields = ['volunteer__email', 'project__project_name', 'application_text']
    list_filter = volunteer_relation_filter_fields

project_commit_text_fields = ['user_name', 'user_link', 'user_avatar_link', 'commit_sha', 'commit_title', 'branch_name', 'repo_name']
project_commit_filter_fields = ('commit_date',)
class ProjectCommitAdmin(admin.ModelAdmin):
    list_display = tuple(project_commit_text_fields) + project_commit_filter_fields
    search_fields = project_commit_text_fields + ['commit_project__project_name']
    list_filter = project_commit_filter_fields

admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectRelationship, ProjectRelationshipAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(UserAlert, UserAlertAdmin)
admin.site.register(VolunteerRelation, VolunteerRelationAdmin)
admin.site.register(ProjectCommit, ProjectCommitAdmin)