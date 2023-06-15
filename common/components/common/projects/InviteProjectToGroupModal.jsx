// @flow

import React from "react";
import metrics from "../../utils/metrics.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import Selector from "../selection/Selector.jsx";
import type { MyGroupData } from "../../utils/CurrentUser.js";

type Props = {|
  projectId: number,
  groups: $ReadOnlyArray<MyGroupData>,
  showModal: boolean,
  handleClose: (?MyGroupData) => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string,
  selectedGroup: MyGroupData,
  showConfirmationModal: boolean,
|};

/**
 * Modal for inviting project to join Group
 */

class InviteProjectToGroupModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: "",
      positionToJoin: null,
      roleTag: null,
      showConfirmationModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props){
      let state: State = {
      showModal: nextProps.showModal,
      selectedGroup: nextProps.groups && nextProps.groups[0],
    };
    return state;
  }

  handleGroupSelection(group: MyGroupData): void {
    this.setState({ selectedGroup: group });
  }

  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  askForSendConfirmation(): void {
    metrics.logGroupInviteProjectSubmit(
      this.state.selectedGroup.group_id,
      this.props.projectId
    );
    this.setState({ showConfirmationModal: true });
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit();
    }
    this.setState({ showConfirmationModal: false });
  }

  handleSubmit() {
    this.setState({ isSending: true });
    metrics.logGroupInviteProjectSubmitConfirm(
      this.state.selectedGroup.group_id,
      this.props.projectId
    );
    ProjectAPIUtils.post(
      "/api/group/" + this.state.selectedGroup.group_id + "/invite",
      {
        message: this.state.message,
        projectId: this.props.projectId,
      },
      response => this.closeModal(true),
      response => null /* TODO: Report error to user */
    );
  }

  closeModal(submitted: boolean): void {
    this.props.handleClose(submitted && this.state.selectedGroup);
    this.setState({
      isSending: false,
      selectedGroup: null,
    });
  }

  render(): React$Node {
    return (
      <div>
        <ConfirmationModal
          showModal={this.state.showConfirmationModal}
          message="Do you want to invite this project?"
          onSelection={this.receiveSendConfirmation}
        />
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Invite Project to join Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Select Group</Form.Label>
                {this._renderGroupSelectionDropdown()}
                <Form.Label>Message:</Form.Label>
                <div className="character-count">
                  {(this.state.message || "").length} / 3000
                </div>
                <Form.Control
                  as="textarea"
                  placeholder="I am inviting this project because..."
                  rows="4"
                  name="message"
                  maxLength="3000"
                  value={this.state.message}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={this.closeModal.bind(this, false)}
            >
              {"Cancel"}
            </Button>
            <Button variant="primary" onClick={this.askForSendConfirmation}>
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  _renderGroupSelectionDropdown(): React$Node {
    const groups: $ReadOnlyArray<MyGroupData> = this.props.groups;
    // TODO: Remove clear X
    return (
      <Selector
        options={groups}
        selected={groups[0]}
        valueStringGenerator={(group: MyGroupData) => group.group_id}
        labelGenerator={(group: MyGroupData) => group.group_name}
        onSelection={this.handleGroupSelection.bind(this)}
      />
    );
  }
}

export default InviteProjectToGroupModal;
