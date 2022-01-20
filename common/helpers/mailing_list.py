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

    def print_error(self, err_msg):
        err_msg = 'Failed to subscribe {first} {last}({email}) to mailing list: {err_msg}'.format(
            first=self.first_name, last=self.last_name, email=self.email, err_msg=err_msg)
        print(err_msg)

    def run(self):
        if settings.MAILCHIMP_API_KEY is None:
            self.print_error('MAILCHIMP_API_KEY not set')
            return False

        api_key = settings.MAILCHIMP_API_KEY
        list_id = settings.MAILCHIMP_SUBSCRIBE_LIST_ID

        api = Mailchimp(api_key)
        try:
            merge_vars = {'FNAME': self.first_name, 'LNAME': self.last_name}
            api.lists.subscribe(list_id, {'email': self.email}, merge_vars=merge_vars)
        except (ListDoesNotExistError, EmailNotExistsError, ListAlreadySubscribedError, Error) as e:
            self.print_error(repr(e))
            return False

