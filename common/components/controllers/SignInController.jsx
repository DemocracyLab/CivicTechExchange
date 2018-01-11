// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import Section from '../enums/Section.js';

type State = {|
  username: string,
  password: string,
|}

class SignInController extends React.PureComponent<{||}, State> {

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
        <form method="post" onSubmit={this._signIn.bind(this)}>
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

  _signIn(): void {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/login/', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      // $FlowFixMe
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 0) {
        console.log('login success', xhr.responseText);
        NavigationDispatcher.dispatch({
          type: 'SET_SECTION',
          section: Section.FindProjects,
        });
      }
    };
    xhr.send(this.state);
  }
}

export default SignInController;
