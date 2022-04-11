import json
import requests
import threading
from urllib import parse as urlparse
import civictechprojects.models
from django.conf import settings
from django.utils import timezone
from common.helpers.user_helpers import is_user_blank_name


def get_user_qiqo_iframe(contributor, request):
    if not contributor.qiqo_uuid:
        SubscribeUserToQiqoChat(contributor)
        return settings.TEST_IFRAME_URL

    source_user_uuid = contributor.uuid
    qiqo_user_uuid = contributor.qiqo_uuid
    if settings.QIQO_IMPERSONATION_ENABLED:
        url_parts = request.GET.urlencode()
        query_params = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
        if 'uuid' in query_params:
            source_user_uuid = query_params['uuid'][0]
        if 'qiqo_uuid' in query_params:
            qiqo_user_uuid = query_params['qiqo_uuid'][0]

    if not hasattr(settings, 'QIQO_IFRAME_URL'):
        return settings.TEST_IFRAME_URL
    else:
        return settings.QIQO_IFRAME_URL.format(api_key=settings.QIQO_API_KEY,
                                      source_user_uuid=source_user_uuid,
                                      qiqo_user_uuid=qiqo_user_uuid)


class SubscribeUserToQiqoChat(object):
    def __init__(self, contributor):
        self.user = contributor
        # Throttle user creation calls to qiqochat
        log_result = 'Subscribe attempt to qiqochat for {user} at {time}'\
            .format(time=timezone.now(), user=self.user.id_full_name())
        if self.user.qiqo_signup_time \
                and (timezone.now() - self.user.qiqo_signup_time).total_seconds() <= settings.QIQO_SIGNUP_TIMEOUT_SECONDS:
            log_result += ':Aborting, last request < {time}s ago'.format(time=settings.QIQO_SIGNUP_TIMEOUT_SECONDS)
        elif is_user_blank_name(self.user):
            log_result += ':Aborting, missing required user name'
        else:
            self.user.qiqo_signup_time = timezone.now()
            self.user.save()
            thread = threading.Thread(target=self.run, args=())
            thread.daemon = True
            thread.start()
        print(log_result)

    def print_error(self, err_msg):
        err_msg = 'Failed to subscribe {first} {last}({email})[{id}] to qiqochat: {err_msg}'.format(
            first=self.user.first_name,
            last=self.user.last_name,
            email=self.user.email,
            id=self.user.id,
            err_msg=err_msg)
        print(err_msg)

    def run(self):
        for key in ['QIQO_USERS_ENDPOINT', 'QIQO_CIRCLE_UUID', 'QIQO_API_KEY', 'QIQO_API_SECRET']:
            if not hasattr(settings, key):
                self.print_error(key + ' not set')
                return False

        data = {
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "email": self.user.email,
                "source_uuid": self.user.uuid,
                "qiqo_circle_uuid": settings.QIQO_CIRCLE_UUID
            },
            "source": {
                "api_key": settings.QIQO_API_KEY,
                "api_secret": settings.QIQO_API_SECRET
            }
        }

        if self.user.about_me:
            data['user']['about_me'] = self.user.about_me

        # TODO: Get thumbnail from cached user
        thumbnail_files = list(civictechprojects.models.ProjectFile.objects.filter(file_user=self.user.id, file_category=civictechprojects.models.FileCategory.THUMBNAIL.value))
        if len(thumbnail_files) > 0:
            data['user']['photo_url'] = thumbnail_files[0].file_url

        r = requests.post(
            settings.QIQO_USERS_ENDPOINT,
            data=json.dumps(data),
            headers={'content-type' : 'application/json'}
        )
        if r.status_code == 200:
            self.user.qiqo_uuid = r.json()['qiqo_user_uuid']
            self.user.save()
        else:
            self.print_error('[{code}] {msg}'.format(code=r.status_code, msg=r.text))
