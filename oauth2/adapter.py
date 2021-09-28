"""
Hooks for customizing login with social providers
https://django-allauth.readthedocs.io/en/latest/advanced.html
"""
from allauth.account.signals import user_logged_in
from common.helpers.front_end import section_url
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from django.dispatch import receiver
from common.helpers.constants import FrontEndSection
from common.helpers.error_handlers import ReportableError
from common.helpers.s3 import copy_external_thumbnail_to_s3
from civictechprojects.models import ProjectFile, FileCategory
from democracylab.models import Contributor
from django.contrib.auth.models import User
from django.utils import timezone
import simplejson as json


class MissingOAuthFieldError(ReportableError):
    """Exception raised when required fields are not returned from OAuth

    Attributes:
        missing_fields -- description of missing fields
        message -- explanation of the error to be reported in the logs
    """

    def __init__(self, message, provider, missing_fields):
        super().__init__(message, {'provider': provider, 'missing_fields': missing_fields})

class MyAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        if 'prev_page' in request.session:
            prev_page = request.session['prev_page']
            prev_page_args = request.session['prev_page_args']
            del request.session['prev_page']
            del request.session['prev_page_args']
            redirect_url = '/' if prev_page.strip('/') == '' else section_url(prev_page, prev_page_args)
        else:
            redirect_url = section_url(FrontEndSection.Home)
        return redirect_url

class SocialAccountAdapter(DefaultSocialAccountAdapter):

    def new_user(self, request, sociallogin):
        email = sociallogin.account.get_provider().extract_common_fields(
                                                   sociallogin.account.extra_data).get('email').lower()
        assert email
        # This account may actually belong to an existing user
        user = User.objects.filter(username=email).first()
        if user:
            # Preserve current password (sociallogin assigns an unusable password)
            if user.has_usable_password():
                sociallogin.account.extra_data.update(password=user.password)
            return Contributor.objects.get_by_natural_key(user.username)
        else:
            return Contributor(email_verified=True, last_login=timezone.now())

    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed.

        You can use this hook to intervene, e.g. abort the login by
        raising an ImmediateHttpResponse
        """
        # standardizing fields across different providers
        provider = sociallogin.account.get_provider()
        data = provider.extract_common_fields(
            sociallogin.account.extra_data)

        full_name = data.get('name')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        if full_name or (first_name and last_name):
            sociallogin.user.first_name = first_name or full_name.split()[0]
            sociallogin.user.last_name = last_name or ' '.join(full_name.split()[1:])
        # Set username to lowercase email
        sociallogin.user.username = sociallogin.user.email.lower()

        password = sociallogin.account.extra_data.get('password')
        if password:
            sociallogin.user.password = password

        if sociallogin.is_existing:
            sociallogin.user.save()  # Update only the user
            return

        # Upsert the User and the SocialAccount
        sociallogin.connect(request, sociallogin.user)

    @receiver(user_logged_in)
    def set_avatar_at_login(sender, sociallogin, **kwargs):
        owner = sociallogin.user.contributor
        user_avatar_url = sociallogin.account.get_provider().get_avatar_url(sociallogin)
        
        if user_avatar_url:
            file_json = copy_external_thumbnail_to_s3(user_avatar_url, sociallogin.account.provider, owner)
            ProjectFile.replace_single_file(owner, FileCategory(file_json['file_category']), file_json)
