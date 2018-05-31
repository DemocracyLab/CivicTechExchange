// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';

type State = {|
  email: string,
|}

class ResetPasswordController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      email: '',
    };
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          Please enter your email and you will receive an email with instructions to reset your password.
        </div>
        <form action="/password_reset/" method="post">
            <DjangoCSRFToken />
            <div>
              Email:
            </div>
            <div>
              <input
                className="LogInController-input"
                name="email"
                onChange={e => this.setState({email: e.target.value})}
                type="text"
              />
            </div>
            <button
              className="LogInController-signInButton"
              disabled={!this.state.email}
              type="submit">
              Submit
            </button>
        </form>
      </div>
    );
  }
}

export default ResetPasswordController;
