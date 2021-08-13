from django.test import TestCase
from common.helpers.collections import find_first, flatten, count_occurrences, distinct


class CollectionsTests(TestCase):

    def setUp(self):

        # For count_occurrences()
        self.test_project = {
            "model": "civictechprojects.project",
            "pk": 28,
            "fields": {
                "project_creator": 12,
                "project_description": "Its Eco Act!",
                "project_description_solution": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dignissim, felis vehicula convallis consectetur, mauris elit dictum nisi, et rhoncus dolor neque et ligula. Nullam volutpat quam non augue faucibus, id hendrerit lacus iaculis. Aliquam eros quam, maximus sit amet maximus ac, mollis et velit. Nulla lacinia fringilla diam nec efficitur. Donec gravida, arcu sit amet luctus efficitur, enim diam bibendum erat, aliquet feugiat risus eros in orci. Aenean eros magna, congue eget orci ut, pulvinar maximus justo. Nulla posuere consectetur tincidunt.",
                "project_description_actions": "The specific solution will be discussed when you decide to work with us. We recently ran an extensive experiment testing the effect of #Newsrooms' algorithm, and we found out that #Newsrooms\u2019 readers acquired significantly more knowledge from news articles in a more efficient way compared to users of other news platforms such as Google News. More balanced (less polarized) news consumption was also achieved.",
                "project_short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dignissim, felis vehicula convallis consectetur, mauris elit dictum nisi, et rhoncus dolor neque et ligula. Nullam volutpat quam non augue faucibus, id hendrerit lacus iaculis. ",
                "project_location": "Other",
                "project_country": "US",
                "project_state": "WA",
                "project_city": "Seattle",
                "project_name": "EcoAct",
                "project_url": "",
                "project_date_created": "2020-03-13T20:47:00.867Z",
                "project_date_modified": "2020-03-13T20:48:13.550Z",
                "is_searchable": True,
                "is_created": True,
            }
        }

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
