from common.helpers.constants import FrontEndSection
from django.conf import settings
from django.contrib.sitemaps import Sitemap
from .models import Project
from datetime import date


class SectionSitemap(Sitemap):
    protocol = "https"
    changefreq = "monthly"
    priority = 0.5
    # TODO: Update this date for each release
    lastmod = settings.SITE_LAST_UPDATED
    pages = [
        str(FrontEndSection.AboutUs.value),
        str(FrontEndSection.FindProjects.value),
        str(FrontEndSection.FindProjects.value) + '&showSplash=1',
        str(FrontEndSection.PartnerWithUs.value),
        str(FrontEndSection.Donate.value),
        str(FrontEndSection.Press.value),
        str(FrontEndSection.ContactUs.value)
    ]

    def items(self):
        return self.pages

    def location(self, page):
        return '/index/?section=' + page


class ProjectSitemap(Sitemap):
    protocol = "https"
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return Project.objects.filter(is_searchable=True).order_by('id')

    def location(self, project):
        return '/index/?section=AboutProject&id=' + str(project.id)

    def lastmod(self, project):
        return project.project_date_modified
