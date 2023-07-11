import threading
from mailchimp3 import MailChimp
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
        err_msg = "Failed to subscribe {first} {last}({email}) to mailing list: {err_msg}".format(
            first=self.first_name,
            last=self.last_name,
            email=self.email,
            err_msg=err_msg,
        )
        print(err_msg)

    def run(self):
        if settings.MAILCHIMP_API_KEY is None:
            self.print_error("MAILCHIMP_API_KEY not set")
            return False

        api_key = settings.MAILCHIMP_API_KEY
        list_id = settings.MAILCHIMP_SUBSCRIBE_LIST_ID

        api = MailChimp(api_key)
        try:
            merge_fields = {"FNAME": self.first_name, "LNAME": self.last_name}
            api.lists.members.create(
                list_id,
                {
                    "email_address": self.email,
                    "status": "subscribed",
                    "merge_fields": merge_fields,
                },
            )
        except (Exception) as e:
            self.print_error(repr(e))
            return False
