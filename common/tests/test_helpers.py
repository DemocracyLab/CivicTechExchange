from collections import OrderedDict
from django.conf import settings
from django.test import TestCase
from common.helpers.caching import is_sitemap_url
from common.helpers.constants import FrontEndSection
from common.helpers.dictionaries import merge_dicts, keys_subset
from common.helpers.front_end import section_path, section_url, get_page_section, get_clean_url
from civictechprojects.sitemaps import SitemapPages


class CommonHelperTests(TestCase):
    def test_prerender_urls(self):
        urls = SitemapPages()
        for url in urls:
            self.assertTrue(is_sitemap_url(url), 'Should be able to prerender ' + url)

    def test_do_not_prerender_urls(self):
        urls = [
            '/projects/signup/',
            section_url(FrontEndSection.FindProjects, {'sortField': 'project_name'})
        ]
        for url in urls:
            self.assertFalse(is_sitemap_url(url), 'Should not be able to prerender ' + url)


class FrontEndHelperTests(TestCase):
    def test_section_path(self):
        expected = '/events/test-slug'
        self.assertEqual(expected, section_path(FrontEndSection.AboutEvent, {'id': 'test-slug'}))

    # TODO: Add test for multiple args
    def test_section_path_with_single_arg(self):
        expected = '/events/test-slug?a=1'
        arg_dict = OrderedDict([('id', 'test-slug'), ('a', '1')])
        self.assertEqual(expected, section_path(FrontEndSection.AboutEvent, arg_dict))

    def test_section_url(self):
        expected = settings.PROTOCOL_DOMAIN + '/events/test-slug'
        self.assertEqual(expected, section_url(FrontEndSection.AboutEvent, {'id': 'test-slug'}))

    def test_get_clean_url(self):
        expected = '&clean'
        self.assertEqual(expected, get_clean_url('&amp;clean'))

    def test_get_page_section(self):
        expected = 'AboutEvent'
        self.assertEqual(expected, get_page_section('/events/test-slug'))


class DictionaryHelperTests(TestCase):
    def test_merge_dicts(self):
        dict_a = {'a': 1, 'b': 2}
        dict_b = {'b': 2, 'c': 3}
        self.assertEqual({'a': 1, 'b': 2, 'c': 3}, merge_dicts(dict_a, dict_b))

    def test_keys_subset(self):
        dict_a = {'a': 1, 'b': 2, 'c': 3}
        self.assertEqual({'a': 1, 'c': 3}, keys_subset(dict_a, ['a', 'c']))