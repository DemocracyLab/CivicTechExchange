// @flow

import React from 'react';

class NewsletterSignup extends React.Component {

render() {
  return (
    <div id="mc_embed_signup">
      <form
        action="https://democracylab.us3.list-manage.com/subscribe/post?u=72af92d0a817dcbf3aa960ee0&amp;id=d3b4c4d81c"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate
      >
        <div id="mc_embed_signup_scroll">
          <div className="mc-field-group SocialFooter-signupcontainer">
            <label htmlFor="mce-EMAIL" />
            <input
              type="email"
              defaultValue=""
              placeholder="Enter your email address"
              name="EMAIL"
              className="required email"
              id="mce-EMAIL"
            />
            <input
              type="submit"
              value="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="button btn"
            />
          </div>
          <div id="mce-responses" className="clear">
            <div className="response mc_display_none" id="mce-error-response" />
            <div className="response mc_display_none" id="mce-success-response" />
          </div>
          <div className="mc_embed_hidden" aria-hidden="true">
            <input
              type="text"
              name="b_72af92d0a817dcbf3aa960ee0_d3b4c4d81c"
              tabIndex="-1"
              defaultValue=""
            />
          </div>
        </div>
      </form>
    </div>;
    )
  }

}

export default NewsletterSignup
