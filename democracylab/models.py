from django.db import models
from django.contrib.auth.models import User

class Contributor(User):
    # TODO: some of these need to be incorporated to jobs/projects
    postal_code = models.CharField(max_length=100)
    phone_primary = models.CharField(max_length=200, blank=True)
    about_me = models.CharField(max_length=10000, blank=True)
    linkedin = models.CharField(max_length=200, blank=True)
    facebook = models.CharField(max_length=200, blank=True)
    website_url = models.CharField(max_length=200, blank=True)
    job_role = models.CharField(max_length=200, blank=True)
    behance = models.CharField(max_length=200, blank=True)
    dribble = models.CharField(max_length=200, blank=True)
    experience_level = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    other_url = models.CharField(max_length=100, blank=True)


def get_request_contributor(request):
    return Contributor.objects.get_by_natural_key(request.user.username)
