import threading
from mailchimp import Mailchimp, ListDoesNotExistError, EmailNotExistsError, ListAlreadySubscribedError, Error
from django.conf import settings


class SubscribeToMailingList(object):
    def __init__(self, email, first_name, last_name):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()

    def run(self):
        # TODO: Don't attempt if API key not set
        api_key = settings.MAILCHIMP_API_KEY
        list_id = settings.MAILCHIMP_SUBSCRIBE_LIST_ID

        api = Mailchimp(api_key)
        try:
            api.lists.subscribe(list_id, {'email': self.email})
        except (ListDoesNotExistError, EmailNotExistsError, ListAlreadySubscribedError, Error) as e:
            print('Failed to subscribe user to mailing list: {first} {last} ({email}) due to {err}'
                  .format(first=self.first_name, last=self.last_name, email=self.email, err=repr(e)))
            return False
