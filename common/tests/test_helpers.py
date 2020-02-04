from django.test import TestCase
from common.helpers.caching import is_sitemap_url
from civictechprojects.sitemaps import all_sitemap_paths


class CommonHelperTests(TestCase):

    def test_prerender_urls(self):
        urls = all_sitemap_paths
        for url in urls:
            self.assertTrue(is_sitemap_url(url), 'Should be able to prerender ' + url)

    def test_do_not_prerender_urls(self):
        urls = [
            '/projects/signup/',
            '/index/?section=FindProjects&sortField=project_name'
        ]
        for url in urls:
            self.assertFalse(is_sitemap_url(url), 'Should not be able to prerender ' + url)


