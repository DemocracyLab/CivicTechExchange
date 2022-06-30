from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_path
from django.conf import settings
from django.contrib.sitemaps import Sitemap
from .models import Project, Group, Event


class SectionSitemap(Sitemap):
    protocol = "https"
    changefreq = "monthly"
    priority = 0.5
    # TODO: Update this date for each release
    lastmod = settings.SITE_LAST_UPDATED
    pages = [
        str(FrontEndSection.Home.value),
        str(FrontEndSection.AboutUs.value),
        str(FrontEndSection.FindProjects.value),
        str(FrontEndSection.Donate.value),
        str(FrontEndSection.ContactUs.value),
        str(FrontEndSection.Companies.value),
        str(FrontEndSection.Privacy.value),
        str(FrontEndSection.Terms.value)
    ]

    def items(self):
        return self.pages

    def location(self, page):
        return section_path(page)


class ProjectSitemap(Sitemap):
    protocol = "https"
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return Project.objects.filter(is_searchable=True).order_by('id')

    def location(self, project):
        return section_path(FrontEndSection.AboutProject.value, {'id': project.id})

    def lastmod(self, project):
        return project.project_date_modified


class GroupSitemap(Sitemap):
    protocol = "https"
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return Group.objects.filter(is_searchable=True).order_by('id')

    def location(self, group):
        return section_path(FrontEndSection.AboutGroup.value, {'id': group.id})

    def lastmod(self, group):
        return group.group_date_modified


class EventSitemap(Sitemap):
    protocol = "https"
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return Event.objects.filter(is_searchable=True, is_private=False).order_by('id')

    def location(self, event):
        event_id = event.event_slug or event.id
        return section_path(FrontEndSection.AboutEvent.value, {'id': event_id})

    def lastmod(self, event):
        return event.event_date_modified


def get_all_sitemap_paths():
    sitemap_paths = []
    for sitemap_class in [SectionSitemap, ProjectSitemap, GroupSitemap, EventSitemap]:
        sitemap_instance = sitemap_class()
        sitemap_paths = sitemap_paths + list(map(lambda item: sitemap_instance.location(item), sitemap_instance.items()))

    return sitemap_paths


class SitemapPages(object):
    __instance = None

    def __new__(cls):
        if SitemapPages.__instance is None:
            SitemapPages.update()
        return SitemapPages.__instance

    @staticmethod
    def update():
        SitemapPages.__instance = get_all_sitemap_paths()
