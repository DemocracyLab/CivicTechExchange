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
    url(
        r'^login/$',
        auth_views.login,
        {'template_name': 'login.html'},
        name='login',
    ),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(
        r'^password_reset/$',
        auth_views.password_reset,
        name="password_reset",
    ),
    url(
        r'^password_reset/done/$',
        auth_views.password_reset_done,
        name="password_reset_done",
    ),
    url(
        r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm,
        name="password_reset_confirm"
    ),
    url(
        r'^reset/done/$',
        auth_views.password_reset_complete,
        name="password_reset_complete",
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
    url(r'^', include('civictechprojects.urls')),
    url(r'^$', RedirectView.as_view(url='/index/', permanent=True)),
    url(r'^admin/', admin.site.urls),
    # url(
    #     r'check_email/(?P<user_email>.*)$',
    #     views.check_email,
    #     name="check_email"
    # )
]