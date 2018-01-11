// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';

type State = {|
  username: string,
  password: string,
|}

class LogInController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      username: '',
      password: '',
    };
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          WELCOME BACK. LOG INTO YOUR ACCOUNT
        </div>
        <form action="/login/" method="post">
            <DjangoCSRFToken />
            <div>
              Email:
            </div>
            <div>
              <input
                className="LogInController-input"
                name="username"
                onChange={e => this.setState({username: e.target.value})}
                type="text"
              />
            </div>
            <div>
              Password:
            </div>
            <div>
              <input
                className="LogInController-input"
                name="password"
                onChange={e => this.setState({password: e.target.value})}
                type="password"
              />
            </div>
            <button
              className="LogInController-signInButton"
              disabled={!this.state.username || !this.state.password}
              type="submit">
              Sign In
            </button>
        </form>
      </div>
    );
  }
}

export default LogInController;
