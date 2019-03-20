// @flow

import React from 'react';
import CurrentUser from "../utils/CurrentUser.js";

type Props = {|

|};

type State = {|
|}

class SignedUpController extends React.Component<Props, State> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    // TODO: Give indication that email has been sent
    return (
      <div className="SignedUpController-root">
        <div className="SignedUpController-logo">
          <img src="/static/images/projectPlaceholder.png"/>
        </div>
        <div className="SignedUpController-greeting">
          <h3>Check your email</h3>
          <p>We've sent a message to {CurrentUser.email()} <br/> with a link to verify your account.</p>
          <p>
            Didn't get an email?
            <br/>
            <a href="/verify_user">Resend verification email</a>
          </p>
        </div>
      </div>
    );
  }
}

export default SignedUpController;
