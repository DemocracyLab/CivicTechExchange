from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url
from common.models.tags import Tag
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase
import civictechprojects.models

#  'user_files': '',
#  'user_links': '[{"linkUrl":"http://www.google.com","linkName":"GOOGLE","visibility":"PUBLIC"},{"linkName":"link_linkedin","linkUrl":"http://www.linkedin.com","visibility":"PUBLIC"}]',


class UserTaggedTechnologies(TaggedItemBase):
    content_object = models.ForeignKey('Contributor')


class Contributor(User):
    email_verified = models.BooleanField(default=False)
    country = models.CharField(max_length=2, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    phone_primary = models.CharField(max_length=200, blank=True)
    about_me = models.CharField(max_length=100000, blank=True)
    user_technologies = TaggableManager(blank=True, through=UserTaggedTechnologies)
    user_technologies.remote_field.related_name = "+"

    def is_admin_contributor(self):
        return self.email == settings.ADMIN_EMAIL

    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def send_verification_email(self):
        # Get token
        user = Contributor.objects.get(id=self.id)
        verification_token = default_token_generator.make_token(user)
        verification_url = settings.PROTOCOL_DOMAIN + '/verify_user/' + str(self.id) + '/' + verification_token
        # Send email with token
        email_msg = EmailMessage(
            'Welcome to DemocracyLab',
            'Click here to confirm your email address (or paste into your browser): ' + verification_url,
            settings.EMAIL_HOST_USER,
            [self.email]
        )
        email_msg.send()

    def send_password_reset_email(self):
        # Get token
        user = Contributor.objects.get(id=self.id)
        reset_parameters = {
            'userId': self.id,
            'token': default_token_generator.make_token(user)
        }
        reset_url = section_url(FrontEndSection.ChangePassword, reset_parameters)
        print(reset_url)
        # Send email with token
        email_msg = EmailMessage(
            'DemocracyLab Password Reset',
            'Click here to change your password: ' + reset_url,
            settings.EMAIL_HOST_USER,
            [self.email]
        )
        email_msg.send()

    def hydrate_to_json(self):
        links = civictechprojects.models.ProjectLink.objects.filter(link_user=self.id)
        files = civictechprojects.models.ProjectFile.objects.filter(file_user=self.id)
        other_files = list(filter(lambda file: file.file_category != civictechprojects.models.FileCategory.THUMBNAIL.value, files))

        user = {
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
        files = civictechprojects.models.ProjectFile.objects.filter(file_user=self.id)

        user = {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
        }

        thumbnail_files = list(files.filter(file_category=civictechprojects.models.FileCategory.THUMBNAIL.value))
        if len(thumbnail_files) > 0:
            user['user_thumbnail'] = thumbnail_files[0].to_json()

        return user


def get_contributor_by_username(username):
    # using .first instead of .get_by_natural_key returns None instead of raising if object does not exist
    return Contributor.objects.filter(email=username).first()


def get_request_contributor(request):
    return get_contributor_by_username(request.user.username)

