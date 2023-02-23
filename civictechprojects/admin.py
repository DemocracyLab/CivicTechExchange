from django.contrib import admin

from .models import Project, Group, Event, ProjectRelationship, UserAlert, VolunteerRelation, ProjectCommit, \
    NameRecord, ProjectFile, Testimonial, ProjectLink, ProjectFavorite, ProjectPosition, EventProject, \
    RSVPVolunteerRelation, EventConferenceRoom, EventConferenceRoomParticipant, EventLocationTimeZone, \
    VolunteerActivityReport

project_text_fields = ['project_name', 'project_description', 'project_description_solution', 'project_description_actions', 'project_short_description', 'project_location', 'project_country', 'project_state', 'project_city', 'project_url']
project_filter_fields = ('project_date_created', 'project_date_modified', 'is_searchable', 'is_created')
class ProjectAdmin(admin.ModelAdmin):
    list_display =  tuple(project_text_fields) + ('project_creator',) + project_filter_fields
    search_fields = project_text_fields + ['project_creator__email']
    list_filter = project_filter_fields
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            obj.recache(recache_linked=True)
        

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
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            obj.recache()
            obj.update_linked_items()

event_text_fields = ['event_name', 'event_agenda', 'event_description','event_location', 'event_rsvp_url', 'event_live_id', 'event_short_description']
event_filter_fields = ('event_date_created', 'event_date_end', 'event_date_modified', 'event_date_start', 'is_searchable', 'is_created', 'show_headers')
class EventAdmin(admin.ModelAdmin):
    list_display = tuple(event_text_fields) + ('event_creator',) + event_filter_fields
    search_fields = event_text_fields + ['event_creator__email']
    list_filter = event_filter_fields
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            obj.recache()
            obj.update_linked_items()
        

user_alert_text_fields = ['email', 'filters', 'country', 'postal_code']
class UserAlertAdmin(admin.ModelAdmin):
    list_display = tuple(user_alert_text_fields)
    search_fields = user_alert_text_fields

volunteer_relation_filter_fields = ('is_approved', 'is_co_owner', 'is_team_leader', 'projected_end_date', 'application_date', 'approved_date', 'last_reminder_date', 'reminder_count', 're_enrolled_last_date', 're_enroll_last_reminder_date', 're_enroll_reminder_count')
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

name_record_text_fields = ['name']
class NameRecordAdmin(admin.ModelAdmin):
    list_display = tuple(name_record_text_fields + ['event'])
    search_fields = name_record_text_fields

class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'file_type', 'file_category', 'file_project', 'file_user', 'file_group', 'file_event', )
    search_fields = ['file_user__email', 'file_project__project_name', 'file_group__group_name', 'file_event__event_name', 'file_key']
    list_filter = ('file_category', 'file_type',)

testimonial_text_fields = ['name', 'title', 'priority', 'source', 'text', 'avatar_url']
class TestimonialAdmin(admin.ModelAdmin):
    list_display = tuple(testimonial_text_fields)
    search_fields = testimonial_text_fields

class ProjectLinkAdmin(admin.ModelAdmin):
    list_display = ('link_name', 'link_url', 'link_user', 'link_project', 'link_group', 'link_event', 'link_visibility',)
    search_fields = ['link_project__project_name', 'link_name']
    list_filter = ('link_visibility',)

class ProjectFavoriteAdmin(admin.ModelAdmin):
    list_display = ('link_project', 'link_user')
    search_fields = ['link_project__project_name', 'link_user__email']

class ProjectPositionAdmin(admin.ModelAdmin):
    list_display = ('position_project', 'position_event', 'position_role')
    search_fields = ['position_project__project_name', 'position_event__event_name']

event_project_text_fields = ['goal', 'scope', 'schedule', 'onboarding_notes']
event_project_filter_fields = ('event', 'project')
# TODO: Add timezone
class EventProjectAdmin(admin.ModelAdmin):
    list_display = event_project_filter_fields + ('creator',) + tuple(event_project_text_fields)
    search_fields = event_project_text_fields + ['creator__email', 'event__event_name', 'project__project_name']
    list_filter = event_project_filter_fields
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            obj.recache()

# TODO: Add timezone
class RSVPVolunteerRelationAdmin(admin.ModelAdmin):
    list_display = ('event', 'volunteer', 'event_project', 'application_text')
    search_fields = ['volunteer__email', 'event__event_name', 'application_text']
    list_filter = ('event',)


class EventConferenceRoomAdmin(admin.ModelAdmin):
    list_display = ('event', 'event_project', 'zoom_id', 'last_activated')
    search_fields = ['event__event_name', ]
    list_filter = ('event',)


class EventConferenceRoomParticipantAdmin(admin.ModelAdmin):
    list_display = ('room', 'zoom_user_name', 'zoom_user_id')
    search_fields = ['event__event_name', ]


class EventLocationTimeZoneAdmin(admin.ModelAdmin):
    list_display = ('event', 'location_name', 'time_zone', 'country', 'state', 'city', 'address_line_1', 'address_line_2')
    search_fields = ['event__event_name', 'time_zone', 'country', 'state', 'city']
    list_filter = ('event',)
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.event.recache(recache_linked=True)


class VolunteerActivityReportAdmin(admin.ModelAdmin):
    list_display = ('project', 'volunteer', 'activity_period_start', 'activity_text')
    search_fields = ['project__project_name', 'volunteer__email']
    list_filter = ('project',)
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.project.recache()


admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectRelationship, ProjectRelationshipAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(UserAlert, UserAlertAdmin)
admin.site.register(VolunteerRelation, VolunteerRelationAdmin)
admin.site.register(ProjectCommit, ProjectCommitAdmin)
admin.site.register(NameRecord, NameRecordAdmin)
admin.site.register(ProjectFile, ProjectFileAdmin)
admin.site.register(Testimonial, TestimonialAdmin)
admin.site.register(ProjectLink, ProjectLinkAdmin)
admin.site.register(ProjectFavorite, ProjectFavoriteAdmin)
admin.site.register(ProjectPosition, ProjectPositionAdmin)
admin.site.register(EventProject, EventProjectAdmin)
admin.site.register(RSVPVolunteerRelation, RSVPVolunteerRelationAdmin)
admin.site.register(EventConferenceRoom, EventConferenceRoomAdmin)
admin.site.register(EventConferenceRoomParticipant, EventConferenceRoomParticipantAdmin)
admin.site.register(EventLocationTimeZone, EventLocationTimeZoneAdmin)
admin.site.register(VolunteerActivityReport, VolunteerActivityReportAdmin)
