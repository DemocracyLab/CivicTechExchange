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
from django.conf.urls import include
from django.urls import re_path
from django.views.generic.base import RedirectView
from common.helpers.error_handlers import handle500

from . import views

# Set custom error handler
handler500 = handle500


urlpatterns = [
    re_path(r'^accounts/', include('oauth2.providers.github.urls')),
    re_path(r'^accounts/', include('oauth2.providers.google.urls')),
    re_path(r'^accounts/', include('oauth2.providers.linkedin.urls')),
    re_path(r'^accounts/', include('oauth2.providers.facebook.urls')),
    re_path(r'^accounts/', include('allauth.urls')),
    re_path(r'^api/signup/add/$', views.add_signup_details, name='add_signup_details'),
    re_path(r'^api/signup/$', views.signup, name='signup'),
    re_path(r'^api/login/$', views.login_view, name='login_view'),
    re_path(r'^api/login/(?P<provider>\w+)', views.login_view, name='login_view'),
    re_path(r'^logout/$', views.logout_view, name='logout_view'),
    re_path(
        r'^password_reset/$',
        views.password_reset,
        name="password_reset",
    ),
    re_path(
        r'^change_password/$',
        views.change_password,
        name="change_password",
    ),
    re_path(
        r'^verify_user/(?P<user_id>[0-9]+)/(?P<token>[0-9a-z\-]+)$',
        views.verify_user,
        name="verify_user"
    ),
    re_path(
        r'^verify_user/$',
        views.send_verification_email_request,
        name="send_verification_email_request"
    ),
    re_path(r'^api/user/edit/(?P<user_id>[0-9]+)/details/$', views.user_edit_details, name='user_edit_details'),
    re_path(r'^api/user/edit/(?P<user_id>[0-9]+)/$', views.user_edit, name='user_edit'),
    re_path(r'^api/user/(?P<user_id>[0-9]+)/$', views.user_details, name='user_details'),
    re_path(r'', include('civictechprojects.urls')),
    re_path(r'^platform$', RedirectView.as_view(url='http://connect.democracylab.org/platform/', permanent=False)),
    re_path('django-rq/', include('django_rq.urls'))
]
