from django.test import TestCase
from common.helpers.redirectors import InvalidArgumentsRedirector, DirtyUrlsRedirector, DeprecatedUrlsRedirector


class RedirectorTests(TestCase):

    def test_InvalidArgumentsRedirector(self):
        invariants = ['/my/projects?projectAwaitingApproval=Project%202', '/']
        test_pairs = [[x, None] for x in invariants] + [['/projects/497?section=AboutProject&id=486', '/projects/497']]

        for test_pair in test_pairs:
            self.assertEqual(InvalidArgumentsRedirector.redirect_to(test_pair[0]), test_pair[1])

    def test_DirtyUrlsRedirector(self):
        before = '/projects?sortField=-project_date_modified&amp;issues=education'
        after = '/projects?sortField=-project_date_modified&issues=education'
        self.assertEqual(DirtyUrlsRedirector.redirect_to(before), after)

    def test_DeprecatedUrlsRedirector(self):
        test_pairs = ['/about/partner', '/events/corporate']
        after = 'http://127.0.0.1:8000/companies'
        for test_pair in test_pairs:
            self.assertEqual(DeprecatedUrlsRedirector.redirect_to(test_pair), after)