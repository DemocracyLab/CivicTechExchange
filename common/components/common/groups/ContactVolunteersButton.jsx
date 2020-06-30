// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {GroupDetailsAPIData} from "../../utils/GroupAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ContactModal from "./ContactModal.jsx";
import metrics from "../../utils/metrics";
import GroupAPIUtils from "../../utils/GroupAPIUtils";
import _ from "lodash";

type Props = {|
  group: ?GroupDetailsAPIData
|};
type State = {|
  group: ?GroupDetailsAPIData,
  showContactModal: boolean
|};

/**
 * Button to open Modal for sending messages to group volunteers
 */
class ContactVolunteersButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      group: props.group,
      showContactModal: false,
    };
    
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this._handleSubmission = this._handleSubmission.bind(this);
  }
  
  handleShow() {
    // TODO: Add metrics
    // metrics.logUserClickContactGroupOwner(CurrentUser.userID(), this.props.group.group_id);
    this.setState({showContactModal: true});
  }
  
  _handleSubmission(fields, closeModal): ?React$Node {
    // TODO: Get close modal working
    GroupAPIUtils.post("/contact/volunteers/" + this.props.group.group_id + "/",
      fields,
      closeModal, //Send function to close modal
      response => null /* TODO: Report error to user */
    );
  }
  
  handleClose() {
    this.setState({showContactModal: false});
  }
  
  _renderContactVolunteerButton(): React$Node {
    return (
      <Button
        className="AboutGroup-button btn btn-theme"
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
          headerText={"Send message to group Volunteers"}
          explanationText={"This email will be sent to all group volunteers. They can reply to your message via your registered email."}
          showSubject={true}
          showModal={this.state.showContactModal}
          handleClose={this.handleClose}
          handleSubmission={this._handleSubmission}
        />
      </React.Fragment>
    );
  }
  
  
  render(): ?React$Node {
    if (CurrentUser.isCoOwnerOrOwner(this.props.group) && !_.isEmpty(this.props.group.group_volunteers)) {
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
