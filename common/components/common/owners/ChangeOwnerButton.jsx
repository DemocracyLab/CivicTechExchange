// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import type { EventData } from "../../utils/EventAPIUtils.js";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import metrics from "../../utils/metrics.js";
import ChangeOwnerModal from "./ChangeOwnerModal.jsx";
import _ from "lodash";

type Props = {|
  project: ?ProjectDetailsAPIData,
  event: ?EventData,
  group: ?GroupDetailsAPIData,
|};
type State = {|
  showModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string,
|};

/**
 * Button to open Modal for changing owner of project.
 */
class ChangeOwnerButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleShow() {
    /*metrics.logGroupInviteProjectClick(
      CurrentUser.userID(),
      this.props.project.project_id
    );*/
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  displayChangeOwnerButton(): ?React$Node {
    return (
      <div>
        <Button
          variant="primary"
          className={(this.props.project && "AboutProject-button") || this.props.event && "AboutEvent-edit-btn" || "AboutGroup-button"}
          type="button"
          onClick={this.handleShow}
        >
          Change Owner
        </Button>
        <ChangeOwnerModal
          project={this.props.project}
          event={this.props.event}
          group={this.props.group}
          showModal={this.state.showModal}
          handleClose={this.closeModal}
        />
      </div>
    );
  }

  render(): ?React$Node {
    if (CurrentUser.isStaff()) {
      return <div>{this.displayChangeOwnerButton()}</div>;
    } else {
      return null;
    }
    
  }
}

export default ChangeOwnerButton;
