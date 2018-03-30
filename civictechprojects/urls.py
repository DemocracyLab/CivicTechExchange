"""democracylab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^projects/edit/(?P<project_id>[0-9]+)/$', views.project_edit, name='project_edit'),
    url(r'^projects/signup/$', views.project_create, name='project_create'),
    url(
        r'^presign_s3/upload/project/thumbnail/$',
        views.presign_project_thumbnail_upload,
    ),
    url(
        r'^delete_s3/(?P<s3_key>.*)$',
        views.delete_uploaded_file,
    ),
    url(r'^api/projects', views.projects_list),
    url(r'^api/my_projects', views.my_projects),
    url(r'^api/tags', views.tags),
    url(r'^index/$', views.index),
    url(r'^project/(?P<project_id>[0-9]+)/$', views.project, name='project'),
    url(r'^api/project/(?P<project_id>[0-9]+)/$', views.get_project, name='get_project')
]
