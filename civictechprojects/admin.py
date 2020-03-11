from django.contrib import admin

from .models import Project, UserAlert, VolunteerRelation, ProjectCommit

admin.site.register(Project)
admin.site.register(UserAlert)
admin.site.register(VolunteerRelation)
admin.site.register(ProjectCommit)