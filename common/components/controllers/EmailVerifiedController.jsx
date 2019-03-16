// @flow

import React from 'react';

type Props = {|

|};

type State = {|
|}

class EmailVerifiedController extends React.Component<Props, State> {
  constructor(): void {
    super();
  }
  
  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          You have verified your email!
        </div>
      </div>
    );
  }
}

export default EmailVerifiedController;
