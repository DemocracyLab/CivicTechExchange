// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';

type State = {|
  firstName: string,
  lastName: string,
  email: string,
  password1: string,
  password2: string,
|}

class LogInController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password1: '',
      password2: '',
    };
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          SIGN UP, IT'S EASY AND FREE
        </div>
        <form action="/signup/" method="post">
          <DjangoCSRFToken />
          <div>
            First Name:
          </div>
          <div>
            <input
              className="LogInController-input"
              name="first_name"
              onChange={e => this.setState({firstName: e.target.value})}
              type="text"
            />
          </div>
          <div>
            Last Name:
          </div>
          <div>
            <input
              className="LogInController-input"
              name="last_name"
              onChange={e => this.setState({lastName: e.target.value})}
              type="text"
            />
          </div>
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
          <div>
            Password:
          </div>
          <div>
            <input
              className="LogInController-input"
              name="password1"
              onChange={e => this.setState({password1: e.target.value})}
              type="password"
            />
          </div>
          <div>
            Re-Enter Password:
          </div>
          <div>
            <input
              className="LogInController-input"
              name="password2"
              onChange={e => this.setState({password2: e.target.value})}
              type="password"
            />
          </div>
          <input name="password" value={this.state.password1} type="hidden" />

          {/* TODO: Replace with visible forms, or modify backend. */}
          <input name="postal_code" value="123456" type="hidden" />
          <input name="username" value={this.state.email} type="hidden" />
          <input
            name="date_joined"
            value={new Date().toLocaleDateString()}
            type="hidden"
          />

          <button
            className="LogInController-signInButton"
            disabled={!this._isInputValid()}
            type="submit">
            Create Account
          </button>
        </form>
      </div>
    );
  }

  _isInputValid(): boolean {
    return this.state.password1 === this.state.password2
      && Object.values(this.state).every(_ => _);
  }
}

export default LogInController;
