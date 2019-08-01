// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ContactModal from "./ContactModal.jsx";
import metrics from "../../utils/metrics";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils";

type Props = {|
  project: ?ProjectDetailsAPIData
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  showContactModal: boolean
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
    this.setState({showContactModal: true});
  }
  
  handleClose() {
    this.setState({showContactModal: false});
  }
  
  _renderContactVolunteerButton(): React$Node {
    return (
      <Button
        className="AboutProject-button btn btn-theme"
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
          explanationText={"Volunteers can reply to your message via your registered email."}
          showModal={this.state.showContactModal}
          handleClose={this.handleClose}
          handleSubmission={this._handleSubmission}
          subjectLine="Contact Volunteer"
        />
      </React.Fragment>
    );
  }
  
  _handleSubmission(body, subject, closeModal): ?React$Node {
    // TODO: Get close modal working
    ProjectAPIUtils.post("/contact/volunteers/" + this.props.project.project_id + "/",
      {message: body, subject: subject}, //TODO: Create sendURL
      response => closeModal, //Send function to close modal
      response => null /* TODO: Report error to user */
    );
  }
  
  render(): ?React$Node {
    if (CurrentUser.isCoOwnerOrOwner(this.props.project)) {
      return (
        <div>
          {this.displayContactVolunteerButton()}
        </div>)
    } else {
      return null;
    }
  }
}

export default ContactVolunteersButton;
