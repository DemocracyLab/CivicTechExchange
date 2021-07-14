// @flow

import React from "react";
import metrics from "../../utils/metrics.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import UserAPIUtils from "../../utils/UserAPIUtils.js";
import EventAPIUtils from "../../utils/EventAPIUtils.js";
import { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import promiseHelper from "../../utils/promise.js";
import Selector from "../selection/Selector.jsx";

type Props = {|
  project: ?ProjectDetailsAPIData,
  event: ?EventData,
  group: ?GroupDetailsAPIData,
  showModal: boolean,
  handleClose: () => void,
|};
type State = {|
  users: $ReadOnlyArray<UserAPIData>,
  selectedUser: UserAPIData,
  currentOwner: UserAPIData,
  showModal: boolean,
  isSending: boolean,
  showConfirmationModal: boolean,
|};

/**
 * Modal for inviting project to join Group
 */

class ChangeOwnerModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      selectedUser: null,
      users: null,
      currentOwner: null,
      showModal: false,
      isSending: false,
      showConfirmationModal: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);
  }

  componentDidMount() {
    UserAPIUtils.fetchAllUserNames(this.loadUsers.bind(this));
    const ownerId = this.props.event ? this.props.event.event_creator : ( this.props.group ? this.props.group.group_creator : this.props.project.project_creator );
    UserAPIUtils.fetchUserDetails(ownerId, this.loadCreator.bind(this));  
  }

  loadUsers(users: $ReadOnlyArray<UserAPIData>) {
    this.setState({
      users: users,
    });
  }

  loadCreator(user: UserAPIData) {
    this.setState({currentOwner: user});
  }

  static getDerivedStateFromProps(props : Props, state : State) : State {
    if (props.showModal !== state.showModal) {
      return { showModal : props.showModal }
    }
    return null;
  }

  handleUserSelection(user: UserAPIData): void {
    this.setState({ selectedUser: user });
  }

  askForSendConfirmation(): void {
    /*metrics.logGroupInviteProjectSubmit(
      this.state.selectedGroup.group_id,
      this.props.projectId
    );*/
    if (this.state.selectedUser) {
        this.setState({ showConfirmationModal: true });
    }
  }

  receiveSendConfirmation(confirmation: boolean): Promise {
    return promiseHelper.promisify(() => {
      if (confirmation) {
        this.handleSubmit();
      }
      this.setState({ showConfirmationModal: false });
    });
  }

  handleSubmit() {
    this.setState({ isSending: true });
    /*metrics.logGroupInviteProjectSubmitConfirm(
      this.state.selectedGroup.group_id,
      this.props.projectId
    );*/
    let id;
    let url_prefix;
    if (this.props.group) {
      id = this.props.group.group_id;
      url_prefix = "group";
    } else if (this.props.project) {
      id = this.props.project.project_id;
      url_prefix = "project";
    } else if (this.props.event) {
      id = this.props.event.event_id;
      url_prefix = "event";
    }

    ProjectAPIUtils.post(
      "/api/" + "change_" + url_prefix + "_owner/" +  id + "/" + this.state.selectedUser.id + "/",
      response => this.updateOwner(),
      response => null
    );

    // TODO: Find out why the callback isn't working.
    this.updateOwner();
  }

  updateOwner(): void {
    this.setState({currentOwner: this.state.selectedUser});
    this.closeModal();
  }

  closeModal(): void {
    this.setState({
      isSending: false,
      selectedUser: null,
    });
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
        <ConfirmationModal
          showModal={this.state.showConfirmationModal}
          message="Do you want to change the project owner?"
          onSelection={this.receiveSendConfirmation}
        />
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Owner</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Current owner:
            {this._renderCurrentOwner()}
            <Form>
              <Form.Group>
                <Form.Label>Please select the new owner:</Form.Label>
                {this._renderUserSelectionDropdown()}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={this.closeModal.bind(this)}
            >
              {"Cancel"}
            </Button>
            <Button variant="primary" onClick={this.askForSendConfirmation} disabled={!this.state.selectedUser}>
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  _renderCurrentOwner(): React$Node {
    if (this.state.currentOwner) {
        const owner = this.state.currentOwner;
        return " " + owner.first_name + " " + owner.last_name;
    }
  }

  _renderUserSelectionDropdown(): React$Node {
    return (
      <Selector 
        options={this.state.users}
        selected={this.state.selectedUser}
        valueStringGenerator={(user: UserAPIData) => user.id}
        labelGenerator={(user: UserAPIData) => user.first_name + " " + user.last_name}
        onSelection={this.handleUserSelection.bind(this)}
        isClearable={false}
      />
    );
  }
}

export default ChangeOwnerModal;
