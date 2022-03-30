// @flow

import React from "react";
import _ from "lodash";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import metrics from "../../utils/metrics.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import TagCategory from "../tags/TagCategory.jsx";
import TagSelector, { tagOptionDisplay } from "../tags/TagSelector.jsx";
import { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import { SelectOption } from "../../types/SelectOption.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import EventProjectAPIUtils from "../../utils/EventProjectAPIUtils.js";

type Props = {|
  eventId: number,
  projectId: number,
  positions: $ReadOnlyArray<PositionInfo>,
  positionToJoin: ?PositionInfo,
  showModal: boolean,
  handleClose: () => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string,
  positionOptions: $ReadOnlyArray<SelectOption>,
  initialPositionSelection: ?SelectOption,
  existingPositionOption: ?SelectOption,
  roleTag: ?TagDefinition,
  showConfirmationModal: boolean,
|};

const OtherRoleOption: SelectOption = { label: "Other", value: "Other" };

/**
 * Modal for rsvp-ing for an event project
 */

class EventProjectRSVPModal extends React.PureComponent<Props, State> {
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
    this._fieldsFilled = this._fieldsFilled.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const noPositionOption: SelectOption = { value: "", label: "---" };
    const positionOptions: $ReadOnlyArray<SelectOption> = [
      noPositionOption,
    ].concat(
      nextProps.positions
        .map((position: PositionInfo) => ({
          value: position.roleTag.tag_name,
          label: tagOptionDisplay(position.roleTag),
        }))
        .concat(OtherRoleOption)
    );

    let state: State = {
      showModal: nextProps.showModal,
      positionOptions: positionOptions,
    };

    if (nextProps.positionToJoin) {
      const initialPositionSelection: SelectOption =
        nextProps.positionToJoin &&
        positionOptions.find(
          option => option.value === nextProps.positionToJoin.roleTag.tag_name
        );
      state.existingPositionOption = state.initialPositionSelection = initialPositionSelection;
    } else {
      state.existingPositionOption = noPositionOption;
    }
    this.setState(state);
    this.forceUpdate();
  }

  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  onRoleChange(role: $ReadOnlyArray<TagDefinition>): void {
    //this fixes an Uncaught TypeError: Cannot read property '0' of null if the user clicks the X to clear the field in the role selector
    this.state.roleTag = !_.isEmpty(role) ? role[0] : null;
    this.forceUpdate();
  }

  askForSendConfirmation(): void {
    metrics.logVolunteerClickVolunteerSubmit(
      CurrentUser.userID(),
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

  handleExistingPositionSelection(positionOption: SelectOption): void {
    if (!_.isEmpty(positionOption.value)) {
      this.setState({ existingPositionOption: positionOption });
    }
  }

  handleSubmit() {
    this.setState({ isSending: true });
    // metrics.logVolunteerClickVolunteerSubmitConfirm(
    //   CurrentUser.userID(),
    //   this.props.projectId
    // );
    EventProjectAPIUtils.rsvpForEventProject(
      this.props.eventId,
      this.props.projectId,
      this.state.message,
      this._selectedTag(),
      response => this.closeModal(true),
      response => null /* TODO: Report error to user */
    );
  }

  closeModal(submitted: boolean) {
    this.setState({
      isSending: false,
      existingPositionOption: null,
    });
    this.props.handleClose(submitted);
  }

  render(): React$Node {
    // TODO: Use ModalWrapper
    return (
      <React.Fragment>
        <ConfirmationModal
          showModal={this.state.showConfirmationModal}
          message="Do you want to apply to this project?"
          onSelection={this.receiveSendConfirmation}
        />
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Volunteer Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                {!_.isEmpty(this.props.positions)
                  ? this._renderExistingPositionDropdown()
                  : null}
                {_.isEmpty(this.props.positions) ||
                (this.state.existingPositionOption &&
                  this.state.existingPositionOption.value ===
                    OtherRoleOption.value)
                  ? this._renderOtherRoleDropdown()
                  : null}
                <Form.Label>Message:</Form.Label>
                <div className="character-count">
                  {(this.state.message || "").length} / 3000
                </div>
                <Form.Control
                  as="textarea"
                  placeholder="I'm interested in helping with this project because..."
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
            <Button
              variant="primary"
              disabled={this.state.isSending || !this._fieldsFilled()}
              onClick={this.askForSendConfirmation}
            >
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

  _fieldsFilled(): boolean {
    return this._selectedTag() && this.state.message;
  }

  _selectedExistingPositionTag(): ?string {
    return this.state.existingPositionOption &&
      this.state.existingPositionOption.value !== OtherRoleOption.value
      ? this.state.existingPositionOption.value
      : null;
  }

  _selectedOtherRoleTag(): ?string {
    return this.state.roleTag && this.state.roleTag.tag_name;
  }

  _selectedTag(): ?string {
    return this._selectedExistingPositionTag() || this._selectedOtherRoleTag();
  }

  _renderExistingPositionDropdown(): React$Node {
    // TODO: Use Selector component
    return (
      <div className="form-group">
        <label htmlFor="project_technologies">Position to Apply For</label>
        <Select
          options={this.state.positionOptions}
          value={
            this.state.existingPositionOption ||
            this.state.initialPositionSelection
          }
          onChange={this.handleExistingPositionSelection.bind(this)}
          simpleValue={true}
          isClearable={false}
          isMulti={false}
        />
      </div>
    );
  }

  _renderOtherRoleDropdown(): React$Node {
    return (
      <div className="form-group">
        <label htmlFor="project_technologies">Role You are Applying For</label>
        <TagSelector
          value={[this.state.roleTag]}
          category={TagCategory.ROLE}
          allowMultiSelect={false}
          isClearable={false}
          onSelection={this.onRoleChange.bind(this)}
        />
      </div>
    );
  }
}

export default EventProjectRSVPModal;