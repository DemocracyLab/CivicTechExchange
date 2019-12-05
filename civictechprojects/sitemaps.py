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
    sections = [FrontEndSection.AboutUs, FrontEndSection.FindProjects, FrontEndSection.PartnerWithUs, FrontEndSection.Donate,
                FrontEndSection.Press, FrontEndSection.ContactUs]

    def items(self):
        return self.sections

    def location(self, section):
        return '/index/?section=' + str(section.value)


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
