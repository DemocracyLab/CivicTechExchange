from django.test import TestCase
from common.helpers.redirectors import InvalidArgumentsRedirector


class RedirectorTests(TestCase):

    def test_InvalidArgumentsRedirector(self):
        invariants = ['/my/projects?projectAwaitingApproval=Project%202', '/']
        test_pairs = [[x, None] for x in invariants] + [['/projects/497?section=AboutProject&id=486', '/projects/497']]

        for test_pair in test_pairs:
            self.assertEqual(InvalidArgumentsRedirector.redirect_to(test_pair[0]), test_pair[1])
