from django.contrib import admin

from .models import Project, Group, Event, ProjectRelationship, UserAlert, VolunteerRelation, ProjectCommit

admin.site.register(Project)
admin.site.register(ProjectRelationship)
admin.site.register(Group)
admin.site.register(Event)
admin.site.register(UserAlert)
admin.site.register(VolunteerRelation)
admin.site.register(ProjectCommit)