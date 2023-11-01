from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from common.helpers.collections import distinct
from common.helpers.random import generate_uuid
from common.helpers.user_helpers import clear_user_context
from common.models.tags import Tag
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase
import civictechprojects.models


class UserTaggedTechnologies(TaggedItemBase):
    content_object = models.ForeignKey('Contributor', on_delete=models.CASCADE)


class Contributor(User):
    email_verified = models.BooleanField(default=False)
    country = models.CharField(max_length=2, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    phone_primary = models.CharField(max_length=200, blank=True)
    about_me = models.CharField(max_length=100000, blank=True)
    user_technologies = TaggableManager(blank=True, through=UserTaggedTechnologies)
    user_technologies.remote_field.related_name = "technology_users"
    uuid = models.CharField(max_length=32, blank=True, default=generate_uuid)
    qiqo_uuid = models.CharField(max_length=50, blank=True)
    qiqo_signup_time = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        existing_user = Contributor.objects.filter(email=self.email).exists()
        if not existing_user or (self.first_name and self.last_name):
            super(Contributor, self).save(*args, **kwargs)

    def __str__(self):
        return self.id_full_name()

    def is_admin_contributor(self):
        return self.email == settings.ADMIN_EMAIL

    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def id_full_name(self):
        return '{id}: {name}'.format(id=self.id, name=self.full_name())

    def is_up_for_volunteering_renewal(self):
        from civictechprojects.models import VolunteerRelation
        volunteer_relations_up_for_renewal = list(filter(lambda vr: vr.is_up_for_renewal(), VolunteerRelation.get_by_user(self)))
        return bool(volunteer_relations_up_for_renewal)

    def hydrate_to_json(self):
        links = self.get_user_links()
        files = self.get_user_files()
        other_files = list(filter(lambda file: file.file_category != civictechprojects.models.FileCategory.THUMBNAIL.value, files))

        user = {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'about_me': self.about_me,
            'country': self.country,
            'postal_code': self.postal_code,
            'user_technologies': Tag.hydrate_to_json(self.id, list(self.user_technologies.all().values())),
            'user_links': list(map(lambda link: link.to_json(), links)),
            'user_files': list(map(lambda file: file.to_json(), other_files)),
        }

        thumbnail_files = list(files.filter(file_category=civictechprojects.models.FileCategory.THUMBNAIL.value))
        if len(thumbnail_files) > 0:
            user['user_thumbnail'] = thumbnail_files[0].to_json()

        return user

    def hydrate_to_tile_json(self):
        files = self.get_user_files()

        user = {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'about_me': self.about_me
        }

        thumbnail_files = list(files.filter(file_category=civictechprojects.models.FileCategory.THUMBNAIL.value))
        if len(thumbnail_files) > 0:
            user['user_thumbnail'] = thumbnail_files[0].to_json()

        return user

    def get_user_links(self):
        return civictechprojects.models.ProjectLink.objects.filter(link_user=self, link_project=None, link_event=None, link_group=None)

    def get_user_files(self):
        return civictechprojects.models.ProjectFile.objects.filter(file_user=self, file_project=None, file_group=None, file_event=None)

    def purge_cache(self):
        clear_user_context(self)

    def update_linked_items(self):
        # Recache owned projects
        owned_projects = civictechprojects.models.Project.objects.filter(project_creator=self)

        # Recache projects user is volunteering with
        volunteering_projects = list(map(lambda vr: vr.project, civictechprojects.models.VolunteerRelation.objects.filter(volunteer=self)))

        all_projects = distinct(owned_projects, volunteering_projects, lambda project: project.id)
        for project in all_projects:
            project.recache()


def get_contributor_by_username(username) -> Contributor | None:
    # using .first instead of .get_by_natural_key returns None instead of raising if object does not exist
    return Contributor.objects.filter(username=username.lower()).first()


def get_request_contributor(request) -> Contributor | None:
    return get_contributor_by_username(request.user.username) if request.user.username else None
