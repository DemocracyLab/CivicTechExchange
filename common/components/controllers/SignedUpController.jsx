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
        <div className="LogInController-greeting">
          You have signed up!  Check your email.
        </div>
      </div>
    );
  }
}

export default SignedUpController;
