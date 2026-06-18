"""
Mailchimp setup instructions

1. Create a Mailchimp account and audience
    - In Mailchimp, create or choose the audience that should receive signups.
    - This module uses member status "subscribed" after DemocracyLab email
      verification, so users are not prompted with a second Mailchimp opt-in email.

2. Create an API key
    - In Mailchimp: Profile -> Extras -> API keys -> Create A Key.
    - Copy the generated key.

3. Configure app environment variables
    - Set MAILCHIMP_API_KEY to your Mailchimp API key.
    - Set MAILCHIMP_SUBSCRIBE_LIST_ID to your audience/list id.

4. Find your audience/list id
    - In Mailchimp audience settings, copy the Audience ID.
    - Use that value for MAILCHIMP_SUBSCRIBE_LIST_ID.

5. Verify the signup flow
    - Start the app and submit signup with newsletter opt-in.
    - Verify the user email first (subscription is deferred until verification).
    - Confirm a "subscribed" member appears in Mailchimp after verification.

Security notes
    - Keep subscription deferred until after DemocracyLab email verification.
    - Keep CAPTCHA and signup rate limiting enabled on the signup endpoint.
"""

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
            email=self.masked_email(),
            err_msg=err_msg,
        )
        print(err_msg)

    def masked_email(self):
        if not self.email or '@' not in self.email:
            return '***'

        local, domain = self.email.split('@', 1)
        visible = local[:2] if len(local) >= 2 else local[:1]
        return '{local}***@{domain}'.format(local=visible, domain=domain)

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
