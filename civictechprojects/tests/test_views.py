from unittest import skip
from django.test import TestCase, Client, tag
from django.urls import reverse
from civictechprojects.models import Project
from democracylab.models import Contributor
# from autofixture import AutoFixture


@tag('integration', 'views')
class CivictechprojectsViewsTestCase(TestCase):

    ''' NOTE: A democracylab Contributor model *MUST* have  
        a lowercase username in order to be looked up  '''
    def setUp(self):
        pass
        # TODO: Find replacement for AutoFixture (See #572)
        # self.client = Client()
        # self.user = AutoFixture(Contributor, field_values = {
        #     'email_verified': True,
        #     'username': 'db@dl.org', #lowercase
        #     'first_name': 'Test',
        #     'last_name': 'User',
        #     }).create(1)[0]
        #
        # self.projectFixture = AutoFixture(Project, field_values = {
        #     'project_creator': self.user,
        #     'project_name': self.user.full_name,
        #     'is_searchable': True,
        #     'deleted': False,
        # }).create(1)[0]

    @skip('Until #572 is fixed')
    def test_project_create(self):
        url = reverse('project_create')

        self.client.force_login(self.user)

        create_project_form = {
            'project_name': __name__,
            'project_short_description': 'short',
            'project_issue_area': '',
            'project_thumbnail_location': ''
        }

        response = self.client.post(url, create_project_form, follow = True)
        new_project = Project.objects.get(project_name=__name__)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_project.project_creator, self.user)

    @skip('Until #572 is fixed')
    def test_allauth_provider_url_resolves(self):
        from allauth.socialaccount import providers
        provider_list = [p.id for p in providers.registry.get_list()]

        for provider in provider_list:
            url = reverse(f'{provider}_login')
            self.assertIsNotNone(url)
