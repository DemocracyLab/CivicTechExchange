// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ContactModal from "../projects/ContactModal.jsx";
import apiHelper from "../../utils/api.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";
import _ from "lodash";

type Props = {|
  eventProject: ?EventProjectAPIDetails,
|};
type State = {|
  eventProject: ?ProjectDetailsAPIData,
  showContactModal: boolean,
|};

/**
 * Button to open Modal for sending messages to event project volunteers
 */
class ContactEventVolunteersButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      eventProject: props.eventProject,
      showContactModal: false,
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this._handleSubmission = this._handleSubmission.bind(this);
  }

  handleShow() {
    // TODO: Add metrics
    this.setState({ showContactModal: true });
  }

  _handleSubmission(fields, closeModal): ?React$Node {
    apiHelper.post(
      `/contact/volunteers/${this.props.eventProject.event_id}/${this.props.eventProject.project_id}/`,
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
          headerText={"Send message to Event Volunteers"}
          explanationText={
            "This email will be sent to all project volunteers for this event. They can reply to your message via your registered email."
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
      (CurrentUser.isCoOwnerOrOwner(this.props.eventProject) ||
        CurrentUser.isStaff()) &&
      !_.isEmpty(this.props.eventProject.event_project_volunteers)
    ) {
      return <div>{this.displayContactVolunteerButton()}</div>;
    } else {
      return null;
    }
  }
}

export default ContactEventVolunteersButton;
