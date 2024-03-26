// @flow

import DjangoCSRFToken from "django-react-csrftoken";
import React from "react";
import type { Validator } from "../forms/FormValidation.jsx";
import FormValidation from "../forms/FormValidation.jsx";
import SocialMediaSignupSection from "../common/integrations/SocialMediaSignupSection.jsx";
import url from "../utils/url.js";
import _ from "lodash";
import Button from "react-bootstrap/Button";

type State = {|
  service: string,
  firstName: string,
  lastName: string,
  validations: $ReadOnlyArray<Validator>,
  isValid: boolean,
|};

class AddSignUpDetails extends React.Component<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      service: url.argument("provider"),
      firstName: "",
      lastName: "",
      isValid: false,
      validations: [
        {
          checkFunc: (state: State) => !_.isEmpty(state.firstName),
          errorMessage: "Please enter First Name",
        },
        {
          checkFunc: (state: State) => !_.isEmpty(state.lastName),
          errorMessage: "Please enter Last Name",
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
      <React.Fragment>
        <div className="LogInController-root">
          <div className="LogInController-greeting">
            <p>
              We were not able to obtain your <strong>First Name</strong> and{" "}
              <strong>Last Name</strong> from {this.state.service}.
            </p>
            <p>Please update the missing information.</p>
          </div>
          <form action="/api/signup/add/" method="post">
            <DjangoCSRFToken />
            <div>First Name:</div>
            <div>
              <input
                className="LogInController-input"
                name="first_name"
                onChange={e => this.setState({ firstName: e.target.value })}
                type="text"
              />
            </div>
            <div>Last Name:</div>
            <div>
              <input
                className="LogInController-input"
                name="last_name"
                onChange={e => this.setState({ lastName: e.target.value })}
                type="text"
              />
            </div>

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
              Create Account
            </Button>
          </form>
          <div className="SignUpController-socialSection">
            <SocialMediaSignupSection
              hideApps={[this.state.service]}
              showEmail={true}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddSignUpDetails;
