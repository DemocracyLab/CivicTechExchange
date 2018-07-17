from django.contrib import admin

from .models import Project, UserAlert

admin.site.register(Project)
admin.site.register(UserAlert)