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
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView

from . import views

urlpatterns = [
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^login/$', views.login_view, name='login_view'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(
        r'^password_reset/$',
        views.password_reset,
        name="password_reset",
    ),
    url(
        r'^change_password/$',
        views.change_password,
        name="change_password",
    ),
    url(
        r'^verify_user/(?P<user_id>[0-9]+)/(?P<token>[0-9a-z\-]+)$',
        views.verify_user,
        name="verify_user"
    ),
    url(
        r'^verify_user/$',
        views.send_verification_email,
        name="send_verification_email"
    ),
    url(r'^api/user/(?P<user_id>[0-9]+)/$', views.user_details, name='user_details'),
    url(r'^api/user/edit/(?P<user_id>[0-9]+)/$', views.user_edit, name='user_edit'),
    url(r'^', include('civictechprojects.urls')),
    url(r'^$', RedirectView.as_view(url='/index/', permanent=False)),
    url(r'^admin/', admin.site.urls),
    url(r'^platform$', RedirectView.as_view(url='http://connect.democracylab.org/platform/', permanent=False)),
    # url(r'^.*$', RedirectView.as_view(url='/index/', permanent=False)),
    # url(
    #     r'check_email/(?P<user_email>.*)$',
    #     views.check_email,
    #     name="check_email"
    # )
]