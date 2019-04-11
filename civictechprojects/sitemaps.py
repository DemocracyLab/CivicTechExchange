from django.contrib.sitemaps import Sitemap
from .models import Project


class ProjectSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return Project.objects.filter(is_searchable=True)

    def location(self, project):
        return '/index/?section=AboutProject&id=' + str(project.id)

    def lastmod(self, project):
        return project.project_date_modified
