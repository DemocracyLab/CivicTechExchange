// @flow

import React from "react";
import { Button } from "react-bootstrap";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import ContactModal, { ContactModalFields } from "../projects/ContactModal.jsx";
import metrics from "../../utils/metrics.js";

type Props = {|
  group: ?GroupDetailsAPIData,
|};
type State = {|
  group: ?GroupDetailsAPIData,
  showContactModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string,
|};

/**
 * Button to open Modal for sending messages to group owners
 */
class ContactGroupButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    if (props.group) {
      this.state = this.getButtonDisplaySetup(props);
    } else {
      this.state = {
        group: null,
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
    const group = props.group;
    const newState = {
      group: group,
      showContactModal: false,
      buttonDisabled: false,
      buttonTitle: "",
    };
    if (!CurrentUser.isLoggedIn()) {
      newState.buttonDisabled = false;
      newState.buttonTitle = "Please sign up or log in to contact group owner";
    } else if (!CurrentUser.isEmailVerified()) {
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle =
        "Please verify your email address before contacting group owner";
    }

    return newState;
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }

  handleShow() {
    metrics.logUserClickContactGroupOwner(
      CurrentUser.userID(),
      this.props.group.group_id
    );
    this.setState({ showContactModal: true });
  }

  handleVolunteerContactModal(
    fields: ContactModalFields,
    closeModal: Function
  ): void {
    ProjectAPIUtils.post(
      "/contact/group/" + this.props.group.group_id + "/",
      fields,
      response => closeModal(),
      response => null /* TODO: Report error to user */
    );
    metrics.logUserContactedGroupOwner(
      CurrentUser.userID(),
      this.props.group.group_id
    );
    this.closeModal();
  }

  closeModal() {
    this.setState({ showContactModal: false });
  }

  _renderEditGroupButton(): React$Node {
    const id = { id: this.props.group.group_id };
    return (
      <Button
        variant="primary"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.section(Section.CreateGroup, id)}
      >
        Edit Group
      </Button>
    );
  }

  //change href to manage page
  _renderManageProjectsButton(): React$Node {
    const id = { id: this.props.group.group_id };
    return (
      <Button
        variant="primary"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.section(Section.CreateGroup, id)}
      >
        Manage Projects
      </Button>
    );
  }

  _renderContactGroupButton(): React$Node {
    return (
      <Button
        variant="primary"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        onClick={this.handleShow}
      >
        Contact Group
      </Button>
    );
  }

  _renderLinkToSignInButton(): React$Node {
    return (
      <Button
        variant="primary"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.logInThenReturn()}
      >
        Contact Group
      </Button>
    );
  }

  displayOwnerButtons(): ?React$Node {
    if (
      CurrentUser.userID() === this.props.group.group_creator ||
      CurrentUser.isCoOwner(this.props.group) ||
      CurrentUser.isStaff()
    ) {
      return <div className="Profile-owner-button-container"><div>{this._renderEditGroupButton()}</div><div>{this._renderManageProjectsButton()}</div></div>;
    }
  }

  displayContactGroupButton(): ?React$Node {
    if (CurrentUser.userID() !== this.props.group.group_creator) {
      return (
        <div>
          {this._renderContactGroupButton()}
          <ContactModal
            headerText={"Send message to Group Owner"}
            explanationText={
              "The group owner will reply to your message via your registered email."
            }
            messagePlaceholderText={""}
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
          <div>
            {this.displayOwnerButtons()}
            {this.displayContactGroupButton()}
          </div>
        );
      } else {
        return <div>{this._renderLinkToSignInButton()}</div>;
      }
    } else {
      return null;
    }
  }
}

export default ContactGroupButton;
