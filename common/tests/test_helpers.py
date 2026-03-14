import re
from django.conf import settings
from django.test import TestCase
from common.helpers.constants import FrontEndSection
from common.helpers.dictionaries import merge_dicts, keys_subset, keys_omit
from common.helpers.form_helpers import is_json_string
from common.helpers.front_end import section_path, section_url, get_page_section, get_clean_url, clean_invalid_args


class FrontEndHelperTests(TestCase):
    def test_section_path(self):
        expected = '/events/test-slug'
        self.assertEqual(expected, section_path(FrontEndSection.AboutEvent, {'id': 'test-slug'}))

    def test_section_path_with_single_arg(self):
        expected = '/events/test-slug?a=1'
        arg_dict = {'id': 'test-slug', 'a': '1'}
        self.assertEqual(expected, section_path(FrontEndSection.AboutEvent, arg_dict))

    def test_section_path_with_multiple_args(self):
        expected_pattern = re.compile(r'/events/test-slug(\?a=1&b=2|\?b=2&a=1)')
        arg_dict = {'id': 'test-slug', 'a': '1', 'b': '2'}
        self.assertRegexpMatches(section_path(FrontEndSection.AboutEvent, arg_dict), expected_pattern)

    def test_section_url(self):
        expected = settings.PROTOCOL_DOMAIN + '/events/test-slug'
        self.assertEqual(expected, section_url(FrontEndSection.AboutEvent, {'id': 'test-slug'}))

    def test_get_clean_url(self):
        expected = '&clean'
        self.assertEqual(expected, get_clean_url('&amp;clean'))

    def test_clean_invalid_args(self):
        self.assertEqual('?projectAwaitingApproval=Project%202', clean_invalid_args('projectAwaitingApproval=Project%202'))

        expected = ['', '?embedded=1', '?sortField=-project_date_modified&issues=education']
        self.assertEqual(expected[0], clean_invalid_args('id=486'))
        self.assertEqual(expected[0], clean_invalid_args('section=AboutProject'))
        self.assertEqual(expected[0], clean_invalid_args('section=AboutProject&id=486'))
        self.assertEqual(expected[1], clean_invalid_args('embedded=1'))
        self.assertEqual(expected[2], clean_invalid_args('sortField=-project_date_modified&issues=education'))
        self.assertEqual(expected[2], clean_invalid_args('id=678&sortField=-project_date_modified&issues=education'))
        self.assertEqual(expected[2], clean_invalid_args('section=AboutGroup&sortField=-project_date_modified&issues=education'))
        self.assertEqual(expected[2], clean_invalid_args('sortField=-project_date_modified&id=678&issues=education'))
        self.assertEqual(expected[2], clean_invalid_args('sortField=-project_date_modified&section=AboutProject&issues=education'))


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

    def test_keys_omit(self):
        dict_a = {'a': 1, 'b': 2, 'c': 3}
        keys = []
        self.assertEqual({'a': 1, 'b': 2, 'c': 3}, keys_omit(dict_a, keys))
        keys.append('d')
        self.assertEqual({'a': 1, 'b': 2, 'c': 3}, keys_omit(dict_a, keys))
        keys.append('a')
        self.assertEqual({'b': 2, 'c': 3}, keys_omit(dict_a, keys))
        keys.append('b')
        self.assertEqual({'c': 3}, keys_omit(dict_a, keys))
        keys.append('c')
        self.assertEqual({}, keys_omit(dict_a, keys))

class FormHelperTests(TestCase):
    def test_is_json_string(self):
        self.assertTrue(is_json_string('{a:1,b:2}'), 'Json should be json')
        self.assertTrue(is_json_string('[{a:1},{b:2}]'), 'Json array should be json')
        self.assertTrue(is_json_string('{}'), 'Empty angle brackets should be json')
        self.assertTrue(is_json_string('[]'), 'Empty square brackets should be json')
        self.assertFalse(is_json_string('blah'), 'Plain text should not be json')
        self.assertFalse(is_json_string(''), 'Empty string should not be json')

