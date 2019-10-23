"""
 Decouples SocialApp client credentials from the database
"""
from django.conf import settings
from allauth.socialaccount.models import SocialApp


'''class App:
    def __init__(self, client_id, secret):
        self.client_id = client_id
        self.secret = secret'''


class SocialAppMixin:
    class Meta:
        abstract = True

    # Get credentials to be used by OAuth2Client
    def get_app(self, request):
        credentials = settings.SOCIAL_APPS.get(self.id)
        return SocialApp(
            name='SocialApp instance',
            provider=self.id,
            client_id=credentials.get('client_id'),
            secret=credentials.get('secret'),
            key=''
        )
