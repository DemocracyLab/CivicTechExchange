// @flow

import React from 'react';
import CurrentUser from '../../components/utils/CurrentUser.js';
import EditProjectForm from '../common/projects/EditProjectForm.jsx'
import NotificationModal from "../common/notification/NotificationModal.jsx";
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';

type State = {|
  showEmailConfirmationModal: boolean,
  emailConfirmationError: boolean
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    
    this.state = {
      showEmailConfirmationModal: false,
      emailConfirmationError: false
    };
  }
  
  logProjectCreated() {
    window.FB.AppEvents.logEvent('projectCreated');
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <NotificationModal
          showModal={this.state.showEmailConfirmationModal}
          message={this.state.emailConfirmationError ? "Failed to send email, please contact admin@democracylab.org" : "Email sent successfully"}
          buttonText="OK"
          headerText={this.state.emailConfirmationError ? "Failure" : "Success"}
          onClickButton={this.closeModal.bind(this)}
        />
        <div className="container">
          {CurrentUser.isEmailVerified() ? this._renderCreateProjectForm() : this._renderEmailNotVerifiedMessage()}
        </div>
      </div>
    );
  }
  
  _renderCreateProjectForm() : React$Node {
    return (
      <form action="/projects/signup/" onSubmit={this.logProjectCreated} method="post">
        <EditProjectForm/>
      </form>
    );
  }
  
  _renderEmailNotVerifiedMessage() : React$Node {
    return (
      <div>
        You have not verified your email address yet.  Check your email inbox and click on the supplied link.
        If you can't find the link,
        click <span className="pseudo-link" onClick={this.sendVerificationEmail.bind(this)}>here</span>
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
    ProjectAPIUtils.post("/verify_user/",
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

export default CreateProjectController;
