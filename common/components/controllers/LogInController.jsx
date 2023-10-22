// @flow

import DjangoCSRFToken from "django-react-csrftoken";
import React from "react";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import metrics from "../utils/metrics.js";
import SocialMediaSignupSection from "../common/integrations/SocialMediaSignupSection.jsx";
import { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
type Props = {|
  prevPage: string,
|};

type State = {|
  username: string,
  password: string,
  prevPage: string,
  validated: boolean,
  prevPageArgs: Dictionary<string>,
|};

class LogInController extends React.Component<Props, State> {
  constructor(props): void {
    super(props);
    const args: Dictionary<string> = url.arguments();
    let checkPrevPage: string = props.prevPage || args["prev"];
    const prevPage: string =
      checkPrevPage === Section.SignUp ? Section.Home : checkPrevPage;
    this.state = {
      username: "",
      password: "",
      validated: false,
      prevPage: prevPage,
    };
    if ("prevPageArgs" in args) {
      this.state.prevPageArgs = decodeURIComponent(args["prevPageArgs"]);
    }
  }

  //if the user is logged in, navigate back to home page
  componentDidMount():void{
    url.ifAuthThenRedirect();
  }

  render(): React$Node {
    const handleSubmit = event => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.setState({ validated: true });
      metrics.logSigninAttempt();
    };

    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          <h4 className="text-uppercase">
            Welcome back. Log into your account
          </h4>
        </div>

        <Form
          noValidate
          validated={this.state.validated}
          action="/api/login/"
          method="post"
          onSubmit={handleSubmit}
        >
          <DjangoCSRFToken />

          <Form.Group controlId="username">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              name="username"
              placeholder="Email"
              onChange={e => this.setState({ username: e.target.value })}
            />
            
            <Form.Control.Feedback type="invalid">
              Please enter your email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="LogInController-other-form-elements">
            <input name="prevPage" value={this.state.prevPage} type="hidden" />
            {this.state.prevPageArgs && (
              <input
                name="prevPageArgs"
                value={JSON.stringify(this.state.prevPageArgs)}
                type="hidden"
              />
            )}
            <div className="LogInController-actionsection">
              <Button
                variant="success"
                className="LogInController-signInButton"
                type="submit"
                onClick={handleSubmit}
              >
                Sign In
              </Button>

              <Button
                variant="link"
                className="LogInController-forgotPassword"
                onClick={url.navigateToSection.bind(
                  this,
                  Section.ResetPassword
                )}
              >
                Forgot Password?
              </Button>

              <Button
                variant="link"
                className="LogInController-createAccount"
                onClick={url.navigateToSection.bind(this, Section.SignUp)}
              >
                Don't Have an Account?
              </Button>
            </div>
            <div className="LogInController-socialSection">
              <SocialMediaSignupSection  prevPage={this.state.prevPage} prevPageArgs={this.state.prevPageArgs}/>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default LogInController;
