// @flow

import React from 'react';
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import NotificationModal from "./NotificationModal.jsx";

type State = {|
  showEmailConfirmationModal: boolean,
  emailConfirmationError: boolean
|};

/**
 * Notifies user they need to confirm their email, with an option to re-send the verification email
 */
class VerifyEmailBlurb extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    
    this.state = {
      showEmailConfirmationModal: false,
      emailConfirmationError: false
    };
  }

  render() : React$Node {
    return (
      <div>
        <NotificationModal
          showModal={this.state.showEmailConfirmationModal}
          message={this.state.emailConfirmationError ? "Failed to send email, please contact admin@democracylab.org" : "Email sent successfully"}
          buttonText="OK"
          headerText={this.state.emailConfirmationError ? "Failure" : "Success"}
          onClickButton={this.closeModal.bind(this)}
        />
        <div>
          You have not verified your email address yet.  Check your email inbox and click on the supplied link.
          If you can't find the link,
          click <span className="pseudo-link" onClick={this.sendVerificationEmail.bind(this)}>here</span>
        </div>
      </div>
    );
  }
  
  closeModal(): void {
    this.setState(
      {
        showEmailConfirmationModal: false,
        emailConfirmationError: false,
      });
  }
  
  sendVerificationEmail(): void {
    ProjectAPIUtils.post("/verify_user/", {},
      response => this.setState(
        {
          showEmailConfirmationModal: true,
          emailConfirmationError: false,
        }),
      response => this.setState(
        {
          showEmailConfirmationModal: true,
          emailConfirmationError: true,
        })
      );
  }
}

export default VerifyEmailBlurb;
