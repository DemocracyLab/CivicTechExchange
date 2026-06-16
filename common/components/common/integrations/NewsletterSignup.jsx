// @flow

import React from "react";
// In mailchimp go to forms > other forms choose the subscription landing page to get the url
class NewsletterSignup extends React.Component {
  render() {
    return (
      <div id="mc_embed_signup">
        <a
          href="https://mailchi.mp/democracylab/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          className={this.props.btnClass}
        >
          Subscribe
        </a>
      </div>
    );
  }
}

export default NewsletterSignup;
