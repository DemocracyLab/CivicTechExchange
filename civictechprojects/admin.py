from django.contrib import admin

from .models import Project, UserAlert, VolunteerRelation

admin.site.register(Project)
admin.site.register(UserAlert)
admin.site.register(VolunteerRelation)