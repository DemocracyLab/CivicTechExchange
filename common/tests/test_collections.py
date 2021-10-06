from django.test import TestCase
from civictechprojects.models import VolunteerRelation, Project
from common.helpers.collections import find_first, flatten, count_occurrences, distinct
from democracylab.models import Contributor


class CollectionsTests(TestCase):

    def setUp(self):

        # For the flatten() function
        self.test_list = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        # For testing the count_occurrences() and find_first() methods
        self.duplicates_list = [1, 2, 4, 4, 6, 5, 2, 8, 1, 6]
        # For distinct() function
        self.distinct_list = [2, 8, 9, 4, 12, 15]
        self.dict_values = {}

    # Test how many times different values occur
    def test_count_occurrences(self):

        expected_results = {
            1: 2,
            2: 2,
            4: 2,
            6: 2,
            5: 1,
            8: 1
        }
        self.assertEqual(count_occurrences(self.duplicates_list), expected_results)

    def test_flatten(self):

        data = self.test_list
        expected_results = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        self.assertEqual(expected_results, flatten(data))

    def test_find_first(self):
        
        func_call = find_first(
            self.duplicates_list,
            lambda x: x > 4
        )
        self.assertEqual(func_call, 6)
    
    def test_distinct(self):

        func_call = distinct(
            self.duplicates_list,
            self.distinct_list,
            lambda x:x 
        )
        expected_vals = [1, 2, 4, 6, 5, 8, 9, 12, 15]

        self.assertEqual(list(func_call), expected_vals)

