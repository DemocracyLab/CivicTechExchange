from django.db import models
from django.contrib.auth.models import User


class Contributor(User):
    postal_code = models.CharField(max_length=100)
    phone_primary = models.CharField(max_length=200, blank=True)
    about_me = models.CharField(max_length=100000, blank=True)


def get_request_contributor(request):
    return Contributor.objects.get_by_natural_key(request.user.username)
