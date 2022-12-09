// @flow

import React from "react";
import _ from "lodash";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import metrics from "../../utils/metrics.js";
import TagCategory from "../tags/TagCategory.jsx";
import TagSelector, { tagOptionDisplay } from "../tags/TagSelector.jsx";
import { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import { SelectOption } from "../../types/SelectOption.jsx";
import { PositionInfo } from "../../forms/PositionInfo.jsx";
import EventProjectAPIUtils, {
  EventProjectAPIDetails,
} from "../../utils/EventProjectAPIUtils.js";
import { EventData, LocationTimezone } from "../../utils/EventAPIUtils.js";
import type { APIResponse } from "../../utils/api.js";
import LocationTimezoneSelector from "../events/LocationTimezoneSelector.jsx";
import RemoteInPersonSelector from "../events/RemoteInPersonSelector.jsx";

type Props = {|
  event?: EventData,
  eventProject: EventProjectAPIDetails,
  positions: $ReadOnlyArray<PositionInfo>,
  positionToJoin: ?PositionInfo,
  showModal: boolean,
  handleClose: (boolean, EventProjectAPIDetails) => void,
  conferenceUrl: ?string,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string,
  positionOptions: $ReadOnlyArray<SelectOption>,
  initialPositionSelection: ?SelectOption,
  existingPositionOption: ?SelectOption,
  roleTag: ?TagDefinition,
  isRemote: boolean,
  locationTimeZone: LocationTimezone,
|};

const OtherRoleOption: SelectOption = { label: "Other", value: "Other" };

/**
 * Modal for rsvp-ing for an event project
 */

class EventProjectRSVPModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = Object.assign(
      {
        isSending: false,
        message: "",
        positionToJoin: props.positionToJoin,
        roleTag: null,
      },
      this.initStateFromProps(props)
    );
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);
    this._fieldsFilled = this._fieldsFilled.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.initStateFromProps(nextProps));
    this.forceUpdate();
  }

  initStateFromProps(nextProps: Props): State {
    const noPositionOption: SelectOption = { value: "", label: "---" };
    const positionOptions: $ReadOnlyArray<SelectOption> = [
      noPositionOption,
    ].concat(
      nextProps.eventProject.event_project_positions
        .filter((position: PositionInfo) => !position.isHidden)
        .map((position: PositionInfo) => ({
          value: position.roleTag.tag_name,
          label: tagOptionDisplay(position.roleTag),
        }))
        .concat(OtherRoleOption)
    );

    let state: State = {
      showModal: nextProps.showModal,
      positionOptions: positionOptions,
      isRemote: false,
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

    return state;
  }

  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  onRoleChange(role: $ReadOnlyArray<TagDefinition>): void {
    //this fixes an Uncaught TypeError: Cannot read property '0' of null if the user clicks the X to clear the field in the role selector
    this.state.roleTag = !_.isEmpty(role) ? role[0] : null;
    this.forceUpdate();
  }

  onRemoteChange(isRemote: boolean): void {
    this.state.isRemote = isRemote;
    this.forceUpdate();
  }

  onLocationChange(locationTimezone: LocationTimezone): void {
    this.state.locationTimeZone = locationTimezone;
    this.forceUpdate();
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit();
    } else {
      this.closeModal(this.props.eventProject, false);
    }
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
    if (this.props.event) {
      EventProjectAPIUtils.rsvpForEvent(
        this.props.event.event_id,
        this.state.isRemote,
        this.state.locationTimeZone,
        (response: APIResponse) => {
          this.closeModal(JSON.parse(response), true);
        },
        response => null /* TODO: Report error to user */
      );
    } else {
      EventProjectAPIUtils.rsvpForEventProject(
        this.props.eventProject.event_id,
        this.props.eventProject.project_id,
        this.state.message,
        this._selectedTag(),
        this.state.isRemote,
        this.state.locationTimeZone,
        (response: APIResponse) => {
          this.closeModal(JSON.parse(response), true);
        },
        response => null /* TODO: Report error to user */
      );
    }
  }

  closeModal(eventProject: EventProjectAPIDetails, submitted: boolean) {
    this.setState({
      isSending: false,
      existingPositionOption: null,
    });
    this.props.handleClose(eventProject, submitted);
  }

  render(): React$Node {
    // TODO: Use ModalWrapper
    const locations: $ReadOnlyArray<LocationTimezone> = (
      this.props.event || this.props.eventProject
    ).event_time_zones;

    return (
      <React.Fragment>
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, this.props.eventProject, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select a Role for the Team</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
              {/* // TODO: Figure out why display always changes to US/PAcific when any remote option is selected */}
              {/* TODO: Figure out why default value not shown */}
                <RemoteInPersonSelector
                  elementId="is_remote"
                  isRemote={this.state.isRemote}
                  onSelection={this.onRemoteChange.bind(this)}
                />
                <LocationTimezoneSelector
                  elementId="location_time_zone"
                  value={this.state.locationTimeZone}
                  show_timezone={this.state.isRemote}
                  location_timezones={locations}
                  onSelection={this.onLocationChange.bind(this)}
                />

                {this.props.eventProject && this._renderEventProjectFields()}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {this.props.conferenceUrl
              ? this._renderJoinVideoButton()
              : this._renderSendCancelButtons()}
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

  _renderEventProjectFields(): React$Node {
    const positions: $ReadOnlyArray<PositionInfo> =
      this.props.eventProject?.event_project_positions || [];
    return (
      <React.Fragment>
        {!_.isEmpty(positions) ? this._renderExistingPositionDropdown() : null}
        {_.isEmpty(positions) ||
        (this.state.existingPositionOption &&
          this.state.existingPositionOption.value === OtherRoleOption.value)
          ? this._renderOtherRoleDropdown()
          : null}
        <Form.Label>
          {"Message: " + (this.props.conferenceUrl ? "(Optional)" : "")}
        </Form.Label>
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
      </React.Fragment>
    );
  }

  _renderSendCancelButtons(): React$Node {
    return (
      <React.Fragment>
        <Button
          variant="outline-secondary"
          onClick={this.closeModal.bind(this, this.props.eventProject, false)}
        >
          {"Cancel"}
        </Button>
        <Button
          variant="primary"
          disabled={this.state.isSending || !this._fieldsFilled()}
          onClick={this.receiveSendConfirmation}
        >
          {this.state.isSending ? "Sending" : "Send"}
        </Button>
      </React.Fragment>
    );
  }

  _renderJoinVideoButton(): React$Node {
    return (
      <React.Fragment>
        <Button
          variant="primary"
          onClick={() => this._selectedTag() && this.handleSubmit()}
          href={this.props.conferenceUrl}
          target="_blank"
        >
          Join Video
        </Button>
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
    const isOptional: boolean = !!this.props.conferenceUrl;
    return (
      <div className="form-group">
        <label htmlFor="project_technologies">
          {"Position to Apply For " + (isOptional ? "(Optional)" : "")}
        </label>
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
