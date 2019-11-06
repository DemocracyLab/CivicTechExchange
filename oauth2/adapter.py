"""
Hooks for customizing login with social providers
https://django-allauth.readthedocs.io/en/latest/advanced.html
"""
from allauth.account.signals import user_logged_in
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.dispatch import receiver
from civictechprojects.models import ProjectFile, FileCategory
from democracylab.models import Contributor
from django.contrib.auth.models import User
from django.utils import timezone


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def new_user(self, request, sociallogin):
        email: str = sociallogin.account.get_provider().extract_common_fields(
                                                   sociallogin.account.extra_data).get('email').lower()
        assert email
        try:
            # This account may actually belong to an existing user
            user = User.objects.get(username=email)
            # Preserve current password (sociallogin assigns an unusable password)
            if user.has_usable_password():
                sociallogin.account.extra_data.update(password=user.password)
            return Contributor.objects.get_by_natural_key(user.username)

        except User.DoesNotExist:
            return Contributor(email_verified=True, last_login=timezone.now())

    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed.

        You can use this hook to intervene, e.g. abort the login by
        raising an ImmediateHttpResponse
        """
        # standardizing fields across different providers
        data = sociallogin.account.get_provider().extract_common_fields(
            sociallogin.account.extra_data)

        full_name = data.get('name')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

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
        user_avatar_url = sociallogin.account.get_provider().avatar_url(sociallogin)
        if user_avatar_url:
            file_json = {
                'publicUrl': user_avatar_url,
                'file_user': owner,
                'file_category': FileCategory.THUMBNAIL.value,
                'visibility': 'PUBLIC',
                'fileName': f'{owner.first_name}{owner.last_name}_thumbnail.{sociallogin.account.provider} avatar',
                'key': f'{sociallogin.account.provider}/{owner.username}'
            }
            ProjectFile.replace_single_file(owner, FileCategory.THUMBNAIL, file_json)
