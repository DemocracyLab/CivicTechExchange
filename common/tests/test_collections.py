from django.test import TestCase
from common.helpers.collections import find_first, flatten, count_occurrences, distinct, omit_falsy


class CollectionsTests(TestCase):

    def setUp(self):
        
        # For testing the count_occurrences() and find_first() methods
        self.duplicates_list = [1, 2, 4, 4, 6, 5, 2, 8, 1, 6]
        # For distinct() function
        self.distinct_list = [2, 8, 9, 4, 12, 15]

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

        # Sample data
        data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
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

    def test_omit_falsy(self):
        self.assertEqual(omit_falsy([0, False, None]), None)
        self.assertEqual(omit_falsy([1, False, None]), [1])
