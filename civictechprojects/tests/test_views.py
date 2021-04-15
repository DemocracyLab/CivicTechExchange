from unittest import skip
from django.test import TestCase, Client, tag
from django.urls import reverse
from django.contrib.auth.models import User
from civictechprojects.models import Project
from democracylab.models import Contributor


@tag('integration', 'views')
class CivictechprojectsViewsTestCase(TestCase):

    ''' NOTE: A democracylab Contributor model *MUST* have  
        a lowercase username in order to be looked up  '''
    def setUp(self):
        
        self.client = Client()
        self.test_user = Contributor.objects.create(
             email_verified=True,
             username='db@dl.org', #lowercase
             first_name='Test',
             last_name='User',
        )

    def test_project_create(self):

        url = reverse('project_create')

        self.client.force_login(self.test_user)

        create_project_form = {
            'project_name': __name__,
            'project_short_description': 'short',
            'project_issue_area': '',
            'project_thumbnail_location': ''
        }

        response = self.client.post(url, create_project_form, follow = True)
        new_project = Project.objects.get(project_name=__name__)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_project.project_creator, self.test_user)

    def test_allauth_provider_url_resolves(self):
        
        from allauth.socialaccount import providers
        provider_list = [p.id for p in providers.registry.get_list()]

        for provider in provider_list:
            url = reverse(f'{provider}_login')
            self.assertIsNotNone(url)
