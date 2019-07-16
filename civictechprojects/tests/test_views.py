from django.test import TestCase, Client, tag
from django.urls import reverse
from civictechprojects.models import Project
from democracylab.models import Contributor
from autofixture import AutoFixture


@tag('integration', 'views')
class CivictechprojectsViewsTestCase(TestCase):

    ''' NOTE: A democracylab Contributor model *MUST* have  
        a lowercase username in order to be looked up  '''
    def setUp(self):
        self.client = Client()
        self.user = AutoFixture(Contributor, field_values = {
            'email_verified': True,
            'username': 'db@dl.org', #lowercase
            'first_name': 'Test',
            'last_name': 'User',
            }).create(1)[0]

        self.projectFixture = AutoFixture(Project, field_values = {
            'project_creator': self.user,
            'project_name': self.user.full_name,
            'is_searchable': True,
            'deleted': False,
        }).create(1)[0]

    def test_project_create(self):
        url = reverse('project_create')

        self.client.force_login(self.user)

        create_project_form = {
            'project_name': __name__,
            'project_short_description': 'short',
            'project_description': 'description',
            'project_url': '',
            'project_location': 'Kirkland, WA',
            'project_organization': '',
            'project_issue_area': '',
            'project_technologies': '',
            'project_stage': '',
            'project_positions': '',
            'project_links': '',
            'project_files': '',
            'project_thumbnail_location': '',
        }

        response = self.client.post(url, create_project_form, follow = True)
        new_project = Project.objects.get(project_name=__name__)

        self.assertRedirects(response, '/index/?section=MyProjects')
        self.assertEqual(new_project.project_creator, self.user)
