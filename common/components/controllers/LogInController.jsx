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
        WELCOME BACK. LOG INTO YOUR ACCOUNT
        <form action="/login/" method="post">
            <DjangoCSRFToken />
            <div>
              Email:
            </div>
            <div>
              <input
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
                name="password"
                onChange={e => this.setState({password: e.target.value})}
                type="password"
              />
            </div>
            <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LogInController;
