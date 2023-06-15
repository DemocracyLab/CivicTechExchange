// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import ProjectAPIUtils, {
  ProjectDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import ContactModal from "./ContactModal.jsx";
import metrics from "../../utils/metrics";

type Props = {|
  project: ?ProjectDetailsAPIData,
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  showContactModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string,
|};

/**
 * Button to open Modal for sending messages to project owners
 */
class ContactProjectButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    if (props.project) {
      this.state = this.getButtonDisplaySetup(props);
    } else {
      this.state = {
        project: null,
        showContactModal: false,
        buttonDisabled: false,
        buttonTitle: "",
      };
    }
    this.handleShow = this.handleShow.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleVolunteerContactModal = this.handleVolunteerContactModal.bind(
      this
    );
  }

  getButtonDisplaySetup(props: Props): State {
    const project = props.project;
    const newState = {
      project: project,
      showContactModal: false,
      buttonDisabled: false,
      buttonTitle: "",
    };
    if (!CurrentUser.isLoggedIn()) {
      newState.buttonDisabled = false;
      newState.buttonTitle =
        "Please sign up or log in to contact project owner";
    } else if (!CurrentUser.isEmailVerified()) {
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle =
        "Please verify your email address before contacting project owner";
    } else if (!project.project_claimed) {
      newState.buttonDisabled = true;
      newState.buttonTitle =
        "This project has not yet been claimed by its owner";
    }

    return newState;
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return this.getButtonDisplaySetup(nextProps);
  }

  handleShow() {
    metrics.logUserClickContactProjectOwner(
      CurrentUser.userID(),
      this.props.project.project_id
    );
    this.setState({ showContactModal: true });
  }

  handleVolunteerContactModal(
    fields: ContactModalFields,
    closeModal: Function
  ): void {
    ProjectAPIUtils.post(
      "/contact/project/" + this.props.project.project_id + "/",
      fields,
      response => closeModal(),
      response => null /* TODO: Report error to user */
    );
    metrics.logUserContactedProjectOwner(
      CurrentUser.userID(),
      this.props.project.project_id
    );
  }

  closeModal() {
    this.setState({ showContactModal: false });
  }

  _renderEditProjectButton(): React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.section(Section.CreateProject, {
          id: this.props.project.project_id,
        })}
      >
        Edit Project
      </Button>
    );
  }

  _renderContactProjectButton(): React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        onClick={this.handleShow}
      >
        Contact Project
      </Button>
    );
  }

  _renderLinkToSignInButton(): React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.logInThenReturn()}
      >
	Contact Project
      </Button>
    );
  }

  displayEditProjectButton(): ?React$Node {
    if (
      CurrentUser.userID() === this.props.project.project_creator ||
      CurrentUser.isCoOwner(this.props.project) ||
      CurrentUser.isStaff()
    ) {
      return <div>{this._renderEditProjectButton()}</div>;
    }
  }

  displayContactProjectButton(): ?React$Node {
    if (CurrentUser.userID() !== this.props.project.project_creator) {
      return (
        <div>
          {this._renderContactProjectButton()}
          <ContactModal
            headerText={"Send message to Project Owner"}
            explanationText={
              "The project owner will reply to your message via your registered email."
            }
            messagePlaceholderText={
              "I'm interested in helping with this project because..."
            }
            showModal={this.state.showContactModal}
            handleSubmission={this.handleVolunteerContactModal}
            handleClose={this.closeModal}
          />
        </div>
      );
    }
  }

  render(): ?React$Node {
    if (this.state) {
      if (CurrentUser.isLoggedIn()) {
        return (
          <React.Fragment>
            {this.displayEditProjectButton()} 
            {this.displayContactProjectButton()}
          </React.Fragment>
        );
      } else {
        return <div>{this._renderLinkToSignInButton()}</div>;
      }
    } else {
      return null;
    }
  }
}

export default ContactProjectButton;
