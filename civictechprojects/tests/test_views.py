from datetime import timedelta
from time import sleep
from typing import Literal
from django.core.cache import cache

from django.test import Client, TestCase, tag
from django.urls import reverse
from django.utils.timezone import now

from civictechprojects.models import Group, Project
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

    def make_many_requests(
        self,
        client: Client,
        method: Literal['get', 'post', 'delete', 'put', 'patch', 'head'],
        params: list[dict],  # [{'path': str, 'data': dict}, ...]
    ):
        """ A helper method to make many requests to a given URL; used by tests """
        cache.clear()  # clear the throttling cache before measuring num of throttled requests
        num_succeeded, num_throttled = 0, 0

        # cache has "1 second" resolution, so throttling counts API calls not from first call to
        # last call but from beginning of second (say, 21:30:45.000) to end of second (21:30:45.999);
        # to make a fair test, we start measuring right at the beginning of a second, thus the sleep:
        sleep(1 - now().microsecond/1_000_000)

        start = now()
        for request_params in params:
            response = getattr(client, method)(**request_params)
            match response.status_code:
                case num if 200 <= num <= 401:
                    num_succeeded += 1
                case 429:
                    num_throttled += 1
                case _:
                    self.assertTrue(False, f'Unexpected response code: {response.status_code}')

        elapsed = now() - start
        self.assertTrue(elapsed < timedelta(seconds=1), f"Expected requests to finish within 1s but it took {elapsed}")
        return num_succeeded, num_throttled

    def test_api_views_throttling__get_group(self):
        group = Group.objects.create(
            group_creator=self.test_user,
            group_name='test-name',
            is_searchable=True,
        )
        url = reverse('get_group', kwargs={'group_id': group.id})

        for is_authenticated in {True, False}:
            client = Client()
            if is_authenticated:
                client.force_login(self.test_user)

            num_succeeded, num_throttled = self.make_many_requests(
                client=client,
                method='get',
                params=[{
                    'path': url,
                }]*12,
            )

            expect_succeeded = 10 if is_authenticated else 5
            self.assertEqual(num_succeeded, expect_succeeded)
            self.assertEqual(num_throttled, 12-expect_succeeded)

    def test_api_views_throttling__group_create(self):
        url = reverse('group_create')

        for is_authenticated in {True, False}:
            client = Client()
            if is_authenticated:
                client.force_login(self.test_user)

            num_succeeded, num_throttled = self.make_many_requests(
                client=client,
                method='post',
                params=[{
                    'path': url,
                    'data': {
                        'group_name': 'test name',
                        'group_description': 'test description',
                        'group_short_description': 'test short description',
                    },
                }]*12,
            )

            expect_succeeded = 10 if is_authenticated else 5
            self.assertEqual(num_succeeded, expect_succeeded)
            self.assertEqual(num_throttled, 12-expect_succeeded)

    def test_api_views_throttling__group_edit(self):
        group = Group.objects.create(
            group_creator=self.test_user,
            group_name='test-name',
            is_searchable=True,
        )
        url = reverse('group_edit', kwargs={'group_id': group.id})

        for is_authenticated in {True, False}:
            client = Client()
            if is_authenticated:
                client.force_login(self.test_user)

            num_succeeded, num_throttled = self.make_many_requests(
                client=client,
                method='post',
                params=[{
                    'path': url,
                    'data': {
                        'group_name': f'test name #{i}',
                        'group_description': 'test description',
                        'group_short_description': 'test short description',
                    },
                } for i in range(12)],
            )

            expect_succeeded = 10 if is_authenticated else 5
            self.assertEqual(num_succeeded, expect_succeeded)
            self.assertEqual(num_throttled, 12-expect_succeeded)

    def test_api_views_throttling__group_delete(self):
        for is_authenticated in {True, False}:
            client = Client()
            if is_authenticated:
                client.force_login(self.test_user)

            groups = Group.objects.bulk_create([
                Group(
                    group_creator=self.test_user,
                    group_name=f'test-name-{i}',
                    is_searchable=True,
                ) for i in range(12)
            ])
            num_succeeded, num_throttled = self.make_many_requests(
                client=client,
                method='post',
                params=[{
                    'path': reverse('group_delete', kwargs={'group_id': group.id}),
                } for group in groups],
            )

            expect_succeeded = 10 if is_authenticated else 5
            self.assertEqual(num_succeeded, expect_succeeded)
            self.assertEqual(num_throttled, 12-expect_succeeded)

    def test_api_views_throttling__project_delete(self):
        for is_authenticated in {True, False}:
            client = Client()
            if is_authenticated:
                client.force_login(self.test_user)

            projects = Project.objects.bulk_create([
                Project(
                    project_creator=self.test_user,
                    project_name=f'test-name-{i}',
                    is_searchable=True,
                ) for i in range(12)
            ])
            num_succeeded, num_throttled = self.make_many_requests(
                client=client,
                method='post',
                params=[{
                    'path': reverse('project_delete', kwargs={'project_id': project.id}),
                } for project in projects],
            )

            expect_succeeded = 10 if is_authenticated else 5
            self.assertEqual(num_succeeded, expect_succeeded)
            self.assertEqual(num_throttled, 12-expect_succeeded)
