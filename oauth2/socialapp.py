"""
 Decouples SocialApp client credentials from the database
"""
from django.conf import settings


class SocialAppMixin:
    class Meta:
        abstract = True

    # Get credentials to be used by OAuth2Client
    def get_app(self, request):
        app = settings.SOCIAL_APPS.get(self.id)
        from allauth.socialaccount.models import SocialApp
        return SocialApp(
            id=app.get('id'),
            name='SocialApp instance',
            provider=self.id,
            client_id=app.get('client_id'),
            secret=app.get('secret'),
            key=''
        )
