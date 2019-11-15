// @flow

import DjangoCSRFToken from 'django-react-csrftoken'
import React from 'react';
import svg, {SVGPath} from "../utils/svg.js";
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
              <div className="text-center">
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
            <a href="/login/linkedin" className="LogInController-socialLink">{svg.path(SVGPath['LINKEDIN'], "LogInController-socialIcon")}</a>
            <a href="/login/google" className="LogInController-socialLink">{svg.path(SVGPath['GOOGLE'], "LogInController-socialIcon")}</a>
            <a href="/login/github" className="LogInController-socialLink">{svg.path(SVGPath['GITHUB'], "LogInController-socialIcon")}</a>
            <a href="/login/facebook" className="LogInController-socialLink">{svg.path(SVGPath['FACEBOOK'], "LogInController-socialIcon")}</a>
        </div>
    )
  }

}

export default LogInController;
