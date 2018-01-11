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
      <div>
        Welcome back. Log into your account.
        <form action="/login/" method="post">
            <DjangoCSRFToken />
            Email:
            <input
              name="username"
              onChange={e => this.setState({username: e.target.value})}
              type="text"
            />
            Password:
            <input
              name="password"
              onChange={e => this.setState({password: e.target.value})}
              type="password"
            />
            <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LogInController;
