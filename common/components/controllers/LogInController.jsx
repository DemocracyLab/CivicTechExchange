// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import metrics from "../utils/metrics.js";

type Props = {|
  prevPage: string,
|}

type State = {|
  username: string,
  password: string,
  prevPage: string
|}

class LogInController extends React.Component<Props, State> {
  constructor(props): void {
    super(props);
    this.state = {
      username: '',
      password: '',
      prevPage: window.location.href.split('&prev=')[1] || this.props.prevPage || ''
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
            <input name="prevPage" value={this.state.prevPage} type="hidden" />
            <div className="LogInController-bottomSection">
              <a href = "" className="LogInController-createAccount" onClick = {url.navigateToSection.bind(this, Section.SignUp)}> Don't Have an Account? </a>
              <span className="LogInController-forgotPassword" onClick = {url.navigateToSection.bind(this, Section.ResetPassword)} >
                <a href = "" className="LogInController-forgotPassword"> Forgot Password? </a>
              </span>
              <button
              className="LogInController-signInButton"
              disabled={!this.state.username || !this.state.password}
              type="submit"
              onClick={() => metrics.logSigninAttempt()}
              >
                Sign In
              </button>
            </div>
            <div className="LogInController-socialSection">
              <div className="centered">
                <p>or sign in with</p>
                {this._render_social_logins()}
              </div>
            </div>
        </form>
      </div>
    );
  }

  _render_social_logins(): React$Node {
    return (
        <div>
            <a href="/login/linkedin" className="LogInController-socialLink"><svg viewBox="0 0 24 24" width="1em" height="1em" className="LogInController-socialIcon"><path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.472-5.611H7.55V9.467h1.978v6.922zm-.99-7.911a.989.989 0 1 1 0-1.978.989.989 0 0 1 0 1.978zm7.912 7.91h-1.978v-3.955a.989.989 0 1 0-1.978 0v3.956h-1.977V9.467h1.977v1.227c.408-.56 1.032-1.227 1.731-1.227 1.229 0 2.225 1.107 2.225 2.472v4.45z"></path></svg></a>
            <a href="/login/google" className="LogInController-socialLink"><svg viewBox="0 0 24 24" width="1em" height="1em" className="LogInController-socialIcon"><path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm.044-5.213c2.445 0 4.267-1.551 4.556-3.781v-1.891h-4.519v1.89h2.602a2.893 2.893 0 0 1-2.724 1.93c-1.194 0-2.677-1.1-2.677-2.843 0-1.621 1.161-2.876 2.677-2.876.739 0 1.413.279 1.922.736l1.399-1.376a4.744 4.744 0 1 0-3.236 8.212z"></path></svg></a>
            <a href="/login/github" className="LogInController-socialLink"><svg viewBox="0 0 24 24" width="1em" height="1em" className="LogInController-socialIcon"><path fillRule="evenodd" d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path></svg></a>
            <a href="/login/facebook" className="LogInController-socialLink"><svg viewBox="0 0 24 24" width="1em" height="1em" className="LogInController-socialIcon"><path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm2.52-14.923v1.686h-1.004c-.366 0-.613.077-.74.23-.128.153-.192.383-.192.69v1.207h1.871l-.249 1.891h-1.622v4.849h-1.955V12.78H9v-1.89h1.629V9.497c0-.792.221-1.407.664-1.843.443-.437 1.033-.655 1.77-.655.626 0 1.111.026 1.456.077z"></path></svg></a>
        </div>
    )
  }

}

export default LogInController;
