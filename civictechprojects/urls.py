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
from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from common.helpers.error_handlers import handle500
from common.urls import v1_urls, v2_urls
from .sitemaps import ProjectSitemap, SectionSitemap, GroupSitemap, EventSitemap


from . import views

# Set custom error handler
handler500 = handle500


urlpatterns = [

    url(
        r'^sitemap\.xml$',
        sitemap,
        {'sitemaps': {
            'sections': SectionSitemap(),
            'projects': ProjectSitemap(),
            'groups': GroupSitemap,
            'event': EventSitemap}},
        name='django.contrib.sitemaps.views.sitemap'
    ),
    url(r'^robots\.txt$', views.robots, name='robots'),
    url(r'^googlebb20bcf8545e7046.html$', TemplateView.as_view(template_name="googlebb20bcf8545e7046.html")),
    url(r'^api/groups/create/$', views.group_create, name='group_create'),
    url(r'^api/groups/approve/(?P<group_id>[0-9]+)/$', views.approve_group, name='approve_group'),
    url(r'^api/groups/edit/(?P<group_id>[0-9]+)/$', views.group_edit, name='group_edit'),
    url(r'^api/groups/delete/(?P<group_id>[0-9]+)/$', views.group_delete, name='group_delete'),
    url(r'^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/create/$', views.event_project_edit, name='event_project_edit'),
    url(r'^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/rsvp/$', views.rsvp_for_event_project, name='rsvp_for_event_project'),
    url(r'^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/cancel/$', views.cancel_rsvp_for_event_project, name='cancel_rsvp_for_event_project'),
    url(r'^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/$', views.get_event_project, name='get_event_project'),
    url(r'^api/event/(?P<event_id>.*)/rsvp/cancel/$', views.cancel_rsvp_for_event, name='cancel_rsvp_for_event'),
    url(r'^api/event/(?P<event_id>.*)/rsvp/$', views.rsvp_for_event, name='rsvp_for_event'),
    url(r'^api/events/create/$', views.event_create, name='event_create'),
    url(r'^api/events/approve/(?P<event_id>[0-9]+)/$', views.approve_event, name='approve_event'),
    url(r'^api/events/edit/(?P<event_id>[0-9]+)/$', views.event_edit, name='event_edit'),
    url(r'^api/events/delete/(?P<event_id>[0-9]+)/$', views.event_delete, name='event_delete'),
    url(r'^api/projects/edit/(?P<project_id>[0-9]+)/$', views.project_edit, name='project_edit'),
    url(r'^api/projects/delete/(?P<project_id>[0-9]+)/$', views.project_delete, name='project_delete'),
    url(r'^api/projects/create/$', views.project_create, name='project_create'),
    url(r'^api/projects/approve/(?P<project_id>[0-9]+)/$', views.approve_project, name='approve_project'),
    url(
        r'^presign_s3/upload/project/thumbnail/$',
        views.presign_project_thumbnail_upload,
    ),
    url(
        r'^delete_s3/(?P<s3_key>.*)$',
        views.delete_uploaded_file,
    ),
    url(r'^api/projects/recent', views.recent_projects),
    url(r'^api/projects', views.project_search),
    url(r'^api/events', views.events_list),
    url(r'^api/limited_listings', views.limited_listings),
    url(r'^api/groups', views.group_search),
    url(r'^api/tags/groups', views.group_tags_counts),
    url(r'^api/tags', views.tags),
    url(r'^admin/', admin.site.urls),
    url(r'^contact/democracylab$', views.contact_democracylab, name='contact_democracylab'),
    url(r'^contact/project/(?P<project_id>[0-9]+)/$', views.contact_project_owner, name='contact_project_owner'),
    url(r'^contact/volunteers/(?P<project_id>[0-9]+)/$', views.contact_project_volunteers, name='contact_project_volunteers'),
    url(r'^contact/volunteer/(?P<application_id>[0-9]+)/$', views.contact_project_volunteer, name='contact_project_volunteer'),
    url(r'^contact/group/(?P<group_id>[0-9]+)/$', views.contact_group_owner, name='contact_group_owner'),
    url(r'', include(v2_urls)),
    url(r'', include(v1_urls)),
    url(r'^api/team$', views.team, name='team'),
    url(r'api/project/(?P<project_id>[0-9]+)/volunteers/$', views.get_project_volunteers,name='get_project_volunteers'),
    url(r'^api/project/(?P<project_id>.*)/$', views.get_project, name='get_project'),
    url(r'^api/group/(?P<group_id>[0-9]+)/invite$', views.invite_project_to_group, name='invite_project_to_group'),
    url(r'^api/invite/(?P<invite_id>[0-9]+)/approve$', views.accept_group_invitation, name='accept_group_invitation'),
    url(r'^api/invite/(?P<invite_id>[0-9]+)/reject$', views.reject_group_invitation, name='reject_group_invitation'),
    url(r'^api/favorite/project/(?P<project_id>[0-9]+)/$', views.project_favorite, name='project_favorite'),
    url(r'^api/unfavorite/project/(?P<project_id>[0-9]+)/$', views.project_unfavorite, name='project_unfavorite'),
    url(r'^api/group/(?P<group_id>.*)/$', views.get_group, name='get_group'),
    url(r'^api/event/(?P<event_id>.*)/$', views.get_event, name='get_event'),
    url(r'^volunteer/(?P<project_id>[0-9]+)/$', views.volunteer_with_project, name='volunteer_with_project'),
    url(r'^volunteer/leave/(?P<project_id>[0-9]+)/$', views.leave_project, name='leave_project'),
    url(r'^volunteer/approve/(?P<application_id>[0-9]+)/$', views.accept_project_volunteer, name='accept_project_volunteer'),
    url(r'^volunteer/reject/(?P<application_id>[0-9]+)/$', views.reject_project_volunteer, name='reject_project_volunteer'),
    url(r'^volunteer/dismiss/(?P<application_id>[0-9]+)/$', views.dismiss_project_volunteer, name='dismiss_project_volunteer'),
    url(r'^volunteer/promote/(?P<application_id>[0-9]+)/$', views.promote_project_volunteer, name='promote_project_volunteer'),
    url(r'^volunteer/demote/(?P<application_id>[0-9]+)/$', views.demote_project_volunteer, name='demote_project_volunteer'),
    url(r'^volunteer/renew/(?P<application_id>[0-9]+)/$', views.renew_volunteering_with_project, name='renew_volunteering_with_project'),
    url(r'^volunteer/conclude/(?P<application_id>[0-9]+)/$', views.conclude_volunteering_with_project, name='conclude_volunteering_with_project'),
    url(r'^alert/create/$', views.add_alert, name='add_alert'),
    url(r'^api/testimonials/(?P<category>[-\w]*)', views.get_testimonials, name='get_testimonials'),
    url(r'^api/v1/qiqo/webhooks/zoom_presences', views.qiqo_webhook, name='qiqo_webhook'),
]
