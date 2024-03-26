// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ContactModal from "./ContactModal.jsx";
import metrics from "../../utils/metrics";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils";
import _ from "lodash";

type Props = {|
  project: ?ProjectDetailsAPIData,
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  showContactModal: boolean,
|};

/**
 * Button to open Modal for sending messages to project volunteers
 */
class ContactVolunteersButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      project: props.project,
      showContactModal: false,
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this._handleSubmission = this._handleSubmission.bind(this);
  }

  handleShow() {
    // TODO: Add metrics
    // metrics.logUserClickContactProjectOwner(CurrentUser.userID(), this.props.project.project_id);
    this.setState({ showContactModal: true });
  }

  _handleSubmission(fields, closeModal): ?React$Node {
    // TODO: Get close modal working
    ProjectAPIUtils.post(
      "/contact/volunteers/" + this.props.project.project_id + "/",
      fields,
      closeModal, //Send function to close modal
      response => null /* TODO: Report error to user */
    );
  }

  handleClose() {
    this.setState({ showContactModal: false });
  }

  _renderContactVolunteerButton(): React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        title={"Contact Volunteers"}
        onClick={this.handleShow}
      >
        Contact Volunteers
      </Button>
    );
  }

  displayContactVolunteerButton(): ?React$Node {
    return (
      <React.Fragment>
        {this._renderContactVolunteerButton()}
        <ContactModal
          headerText={"Send message to Project Volunteers"}
          explanationText={
            "This email will be sent to all project volunteers. They can reply to your message via your registered email."
          }
          showSubject={true}
          showModal={this.state.showContactModal}
          handleClose={this.handleClose}
          handleSubmission={this._handleSubmission}
        />
      </React.Fragment>
    );
  }

  render(): ?React$Node {
    if (
      (CurrentUser.isCoOwnerOrOwner(this.props.project) ||
        CurrentUser.isStaff()) &&
      !_.isEmpty(this.props.project.project_volunteers)
    ) {
      return <div>{this.displayContactVolunteerButton()}</div>;
    } else {
      return null;
    }
  }
}

export default ContactVolunteersButton;
