from django.test import TestCase
from common.helpers.collections import find_first, flatten, count_occurrences, distinct


class CollectionsTests(TestCase):

    def setUp(self):

        # For the flatten() function
        self.test_array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        # For testing the count_occurrences() method
        self.duplicates = [1, 2, 4, 4, 6, 5, 2, 8, 1, 6]

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
        self.assertEqual(count_occurrences(self.duplicates), expected_results)


    def test_flatten(self):

        data = self.test_array
        expected_results = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        self.assertEqual(expected_results, flatten(data))
