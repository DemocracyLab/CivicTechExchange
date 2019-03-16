// @flow

import React from 'react';

type Props = {|

|};

type State = {|
|}

class SignedUpController extends React.Component<Props, State> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <img src="/static/images/projectPlaceholder.png" />
        <div className="LogInController-greeting">
          <h3>Check your email</h3>
          <p>We've sent a message to ...@gmail.com</p>
          <p>with a link to verify your account.</p>
          <br></br>
          <p>Didn't get an email?</p>
          <p>Resend verification email</p>
        </div>
      </div>
    );
  }
}

export default SignedUpController;
