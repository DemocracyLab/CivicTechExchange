// @flow

import DjangoCSRFToken from "django-react-csrftoken";
import React from "react";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import metrics from "../utils/metrics.js";
import SocialMediaSignupSection from "../common/integrations/SocialMediaSignupSection.jsx";
import { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

type Props = {|
  prevPage: string,
|};

type State = {|
  username: string,
  password: string,
  prevPage: string,
  prevPageArgs: Dictionary<string>,
|};

class LogInController extends React.Component<Props, State> {
  constructor(props): void {
    super(props);
    const args: Dictionary<string> = url.arguments();
    let checkPrevPage: string = props.prevPage || args["prev"];
    const prevPage: string = (checkPrevPage === Section.SignUp ? Section.Home : checkPrevPage);
    const prevPageArgs: Dictionary<string> = _.omit(args, "prev");
    this.state = {
      username: "",
      password: "",
      prevPage: prevPage,
      prevPageArgs: prevPageArgs,
    };
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          WELCOME BACK. LOG INTO YOUR ACCOUNT
        </div>
        <form action="/api/login/" method="post">
          <DjangoCSRFToken />
          <div>Email:</div>
          <div>
            <input
              className="LogInController-input"
              name="username"
              onChange={e => this.setState({ username: e.target.value })}
              type="text"
            />
          </div>
          <div>Password:</div>
          <div>
            <input
              className="LogInController-input"
              name="password"
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
            />
          </div>
          <input name="prevPage" value={this.state.prevPage} type="hidden" />
          <input
            name="prevPageArgs"
            value={JSON.stringify(this.state.prevPageArgs)}
            type="hidden"
          />
          <div className="LogInController-bottomSection">
            <a
              href=""
              className="LogInController-createAccount"
              onClick={url.navigateToSection.bind(this, Section.SignUp)}
            >
              {" "}
              Don't Have an Account?{" "}
            </a>
            <span
              className="LogInController-forgotPassword"
              onClick={url.navigateToSection.bind(this, Section.ResetPassword)}
            >
              <a href="" className="LogInController-forgotPassword">
                {" "}
                Forgot Password?{" "}
              </a>
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
            <SocialMediaSignupSection />
          </div>
        </form>
      </div>
    );
  }
}

export default LogInController;
