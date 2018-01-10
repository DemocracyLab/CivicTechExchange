// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';

class SignInController extends React.PureComponent<{||}> {

  render(): React$Node {
    return (
      <div>
        Welcome back. Log into your account.
        <form action='/login/' method="post">
            <DjangoCSRFToken />
            Email:
            <input type="text" name="username" />
            Password:
            <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default SignInController;
