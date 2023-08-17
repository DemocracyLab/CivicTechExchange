// @flow

import DjangoCSRFToken from "django-react-csrftoken";
import React from "react";
import Button from "react-bootstrap/Button";
import CurrentUser from "../utils/CurrentUser";
import urlHelper from "../utils/url";
import Section from "../enums/Section";
type State = {|
  email: string,
|};

class ResetPasswordController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      email: "",
    };
  }

 //if the user is logged in, navigate back to home page
 componentDidMount():void{
  if (CurrentUser.isLoggedIn()) {
    document.location.href = urlHelper.section(Section.Home);
  }
}
  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">
          Please enter your email and you will receive an email with
          instructions to reset your password.
        </div>
        <form action="/password_reset/" method="post">
          <DjangoCSRFToken />
          <div>Email:</div>
          <div>
            <input
              className="LogInController-input"
              name="email"
              onChange={e => this.setState({ email: e.target.value })}
              type="text"
            />
          </div>
          <Button
          variant="success"
            className="LogInController-signInButton"
            disabled={!this.state.email}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default ResetPasswordController;
