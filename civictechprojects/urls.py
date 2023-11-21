"""democracylab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  re_path(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  re_path(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  re_path(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.urls import re_path
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
    re_path(
        r"^sitemap\.xml$",
        sitemap,
        {
            "sitemaps": {
                "sections": SectionSitemap(),
                "projects": ProjectSitemap(),
                "groups": GroupSitemap,
                "event": EventSitemap,
            }
        },
        name="django.contrib.sitemaps.views.sitemap",
    ),
    re_path(r"^robots\.txt$", views.robots, name="robots"),
    re_path(
        r"^googlebb20bcf8545e7046.html$",
        TemplateView.as_view(template_name="googlebb20bcf8545e7046.html"),
    ),
    re_path(r"^api/groups/create/$", views.group_create, name="group_create"),
    re_path(
        r"^api/groups/approve/(?P<group_id>[0-9]+)/$",
        views.approve_group,
        name="approve_group",
    ),
    re_path(
        r"^api/groups/edit/(?P<group_id>[0-9]+)/$", views.group_edit, name="group_edit"
    ),
    re_path(
        r"^api/groups/delete/(?P<group_id>[0-9]+)/$",
        views.group_delete,
        name="group_delete",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/create/$",
        views.event_project_edit,
        name="event_project_edit",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/rsvp/$",
        views.rsvp_for_event_project,
        name="rsvp_for_event_project",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/cancel/$",
        views.cancel_rsvp_for_event_project,
        name="cancel_rsvp_for_event_project",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/projects/(?P<project_id>.*)/$",
        views.get_event_project,
        name="get_event_project",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/rsvp/cancel/$",
        views.cancel_rsvp_for_event,
        name="cancel_rsvp_for_event",
    ),
    re_path(
        r"^api/event/(?P<event_id>.*)/rsvp/$",
        views.rsvp_for_event,
        name="rsvp_for_event",
    ),
    re_path(r"^api/events/create/$", views.event_create, name="event_create"),
    re_path(
        r"^api/events/approve/(?P<event_id>[0-9]+)/$",
        views.approve_event,
        name="approve_event",
    ),
    re_path(
        r"^api/events/edit/(?P<event_id>[0-9]+)/$", views.event_edit, name="event_edit"
    ),
    re_path(
        r"^api/events/delete/(?P<event_id>[0-9]+)/$",
        views.event_delete,
        name="event_delete",
    ),
    re_path(
        r"^api/projects/edit/(?P<project_id>[0-9]+)/$",
        views.project_edit,
        name="project_edit",
    ),
    re_path(
        r"^api/projects/delete/(?P<project_id>[0-9]+)/$",
        views.project_delete,
        name="project_delete",
    ),
    re_path(r"^api/projects/create/$", views.project_create, name="project_create"),
    re_path(
        r"^api/projects/approve/(?P<project_id>[0-9]+)/$",
        views.approve_project,
        name="approve_project",
    ),
    re_path(
        r"^presign_s3/upload/project/thumbnail/$",
        views.presign_project_thumbnail_upload,
    ),
    re_path(
        r"^delete_s3/(?P<s3_key>.*)$",
        views.delete_uploaded_file,
    ),
    re_path(r"^api/projects/recent", views.recent_projects),
    re_path(r"^api/projects", views.project_search),
    re_path(r"^api/events/upcoming", views.upcoming_events),
    re_path(r"^api/events", views.events_list),
    re_path(r"^api/limited_listings", views.limited_listings),
    re_path(r"^api/groups", views.group_search),
    re_path(r"^api/tags/groups", views.group_tags_counts),
    re_path(r"^api/tags", views.tags),
    re_path(r"^admin/", admin.site.urls),
    re_path(
        r"^contact/democracylab$",
        views.contact_democracylab,
        name="contact_democracylab",
    ),
    re_path(
        r"^contact/project/(?P<project_id>[0-9]+)/$",
        views.contact_project_owner,
        name="contact_project_owner",
    ),
    re_path(
        r"^contact/volunteers/(?P<event_id>[0-9]+)/(?P<project_id>[0-9]+)/$",
        views.contact_event_project_volunteers,
        name="contact_event_project_volunteers",
    ),
    re_path(
        r"^contact/volunteers/(?P<project_id>[0-9]+)/$",
        views.contact_project_volunteers,
        name="contact_project_volunteers",
    ),
    re_path(
        r"^contact/volunteer/(?P<application_id>[0-9]+)/$",
        views.contact_project_volunteer,
        name="contact_project_volunteer",
    ),
    re_path(
        r"^contact/group/(?P<group_id>[0-9]+)/$",
        views.contact_group_owner,
        name="contact_group_owner",
    ),
    re_path(r"", include(v2_urls)),
    re_path(r"", include(v1_urls)),
    re_path(r"^api/team$", views.team, name="team"),
    re_path(
        r"api/project/(?P<project_id>[0-9]+)/volunteers/$",
        views.get_project_volunteers,
        name="get_project_volunteers",
    ),
    re_path(
        r"^api/project/(?P<project_id>.*)/$", views.get_project, name="get_project"
    ),
    re_path(
        r"^api/group/(?P<group_id>[0-9]+)/invite$",
        views.invite_project_to_group,
        name="invite_project_to_group",
    ),
    re_path(
        r"^api/invite/(?P<invite_id>[0-9]+)/approve$",
        views.accept_group_invitation,
        name="accept_group_invitation",
    ),
    re_path(
        r"^api/invite/(?P<invite_id>[0-9]+)/reject$",
        views.reject_group_invitation,
        name="reject_group_invitation",
    ),
    re_path(
        r"^api/favorite/project/(?P<project_id>[0-9]+)/$",
        views.project_favorite,
        name="project_favorite",
    ),
    re_path(
        r"^api/unfavorite/project/(?P<project_id>[0-9]+)/$",
        views.project_unfavorite,
        name="project_unfavorite",
    ),
    re_path(r"^api/group/(?P<group_id>.*)/$", views.get_group, name="get_group"),
    re_path(r"^api/event/(?P<event_id>.*)/$", views.get_event, name="get_event"),
    re_path(
        r"^volunteer/(?P<project_id>[0-9]+)/$",
        views.volunteer_with_project,
        name="volunteer_with_project",
    ),
    re_path(
        r"^volunteer/leave/(?P<project_id>[0-9]+)/$",
        views.leave_project,
        name="leave_project",
    ),
    re_path(
        r"^volunteer/approve/(?P<application_id>[0-9]+)/$",
        views.accept_project_volunteer,
        name="accept_project_volunteer",
    ),
    re_path(
        r"^volunteer/reject/(?P<application_id>[0-9]+)/$",
        views.reject_project_volunteer,
        name="reject_project_volunteer",
    ),
    re_path(
        r"^volunteer/dismiss/(?P<application_id>[0-9]+)/$",
        views.dismiss_project_volunteer,
        name="dismiss_project_volunteer",
    ),
    re_path(
        r"^volunteer/promote/(?P<application_id>[0-9]+)/$",
        views.promote_project_volunteer,
        name="promote_project_volunteer",
    ),
    re_path(
        r"^volunteer/demote/(?P<application_id>[0-9]+)/$",
        views.demote_project_volunteer,
        name="demote_project_volunteer",
    ),
    re_path(
        r"^volunteer/renew/(?P<application_id>[0-9]+)/$",
        views.renew_volunteering_with_project,
        name="renew_volunteering_with_project",
    ),
    re_path(
        r"^volunteer/conclude/(?P<application_id>[0-9]+)/$",
        views.conclude_volunteering_with_project,
        name="conclude_volunteering_with_project",
    ),
    re_path(r"^alert/create/$", views.add_alert, name="add_alert"),
    re_path(
        r"^api/testimonials/(?P<category>[-\w]*)",
        views.get_testimonials,
        name="get_testimonials",
    ),
    re_path(
        r"^api/v1/qiqo/webhooks/zoom_presences", views.qiqo_webhook, name="qiqo_webhook"
    ),
    re_path(r"^api/volunteers_stats", views.get_overall_stats, name="active_volunteers"),
    re_path(r"^api/impact_data", views.dollar_impact, name="impact_data"),
    re_path(r"^api/volunteers_history_stats", views.volunteer_history, name="volunteer_history"),
    re_path(r"^api/volunteer_roles", views.volunteer_roles, name="volunteer_roles"),
    re_path(r"^api/project_issue_areas", views.project_area, name="project_issue_areas"),
    re_path(r"^api/hackathon_stats", views.hackathon_stats, name="hackathon_stats")
]
