// @flow

import DjangoCSRFToken from "django-react-csrftoken";
import React from "react";
import Button from "react-bootstrap/Button";
import type { Validator } from "../forms/FormValidation.jsx";
import FormValidation from "../forms/FormValidation.jsx";
import url from "../utils/url.js";

type State = {|
  userId: string,
  token: string,
  password1: string,
  password2: string,
  validations: $ReadOnlyArray<Validator>,
  isValid: boolean,
|};

class ChangePasswordController extends React.Component<{||}, State> {
  minimumPasswordLength: number;

  constructor(): void {
    super();

    // Make sure to keep validators in sync with the backend validators specified in settings.py
    // TODO: Refactor these common password validations into helper library
    this.minimumPasswordLength = 8;
    this.hasNumberPattern = new RegExp("[0-9]");
    this.hasLetterPattern = new RegExp("[A-Za-z]");
    this.hasSpecialCharacterPattern = new RegExp("[^A-Za-z0-9]");

    const args = url.arguments(document.location.search);
    this.state = {
      userId: args.userId,
      token: args.token,
      password1: "",
      password2: "",
      isValid: false,
      validations: [
        {
          checkFunc: (state: State) =>
            state.password1.length >= this.minimumPasswordLength,
          errorMessage: `Password must be at least ${this.minimumPasswordLength} characters`,
        },
        {
          checkFunc: (state: State) => {
            return (
              this.hasNumberPattern.test(state.password1) &&
              this.hasLetterPattern.test(state.password1) &&
              this.hasSpecialCharacterPattern.test(state.password1)
            );
          },
          errorMessage:
            "Password must contain at least one letter, one number, and one special character (examples: !,@,$,&)",
        },
        {
          checkFunc: (state: State) => state.password1 === state.password2,
          errorMessage: "Passwords don't match",
        },
      ],
    };
  }

  onValidationCheck(isValid: boolean): void {
    if (isValid !== this.state.isValid) {
      this.setState({ isValid });
    }
  }

  render(): React$Node {
    return (
      <div className="LogInController-root">
        <div className="LogInController-greeting">Enter new password</div>
        <form action="/change_password/" method="post">
          <DjangoCSRFToken />
          <div>Password:</div>
          <div>
            <input
              className="LogInController-input"
              name="password1"
              onChange={e => this.setState({ password1: e.target.value })}
              type="password"
            />
          </div>
          <div>Re-Enter Password:</div>
          <div>
            <input
              className="LogInController-input"
              name="password2"
              onChange={e => this.setState({ password2: e.target.value })}
              type="password"
            />
          </div>
          <input name="password" value={this.state.password1} type="hidden" />
          <input name="userId" value={this.state.userId} type="hidden" />
          <input name="token" value={this.state.token} type="hidden" />

          <FormValidation
            validations={this.state.validations}
            onValidationCheck={this.onValidationCheck.bind(this)}
            formState={this.state}
          />

          <Button
            variant="success"
            className="LogInController-signInButton"
            disabled={!this.state.isValid}
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </div>
    );
  }
}

export default ChangePasswordController;
