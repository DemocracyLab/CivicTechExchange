// @flow

import React from "react";
import metrics from "../../utils/metrics.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import datetime, { DateFormat } from "../../utils/datetime.js";
import { SelectOption } from "../../types/SelectOption.jsx";
import Select from "react-select";

type Props = {|
  applicationId: number,
  showModal: boolean,
  handleClose: boolean => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  daysToVolunteerForOption: ?SelectOption,
  message: ?string,
|};

const volunteerPeriodsInDays: $ReadOnlyArray<SelectOption> = [
  ["1 week - 1 month", 30],
  ["1 month - 3 months", 90],
  ["3 months - 6 months", 180],
  ["6 months - 1 year", 365],
].map(textDaysPair => ({ label: textDaysPair[0], value: textDaysPair[1] }));

/**
 * Modal for renewing volunteer commitment
 */

class ProjectVolunteerRenewModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: "",
      daysToVolunteerForOption: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this._fieldsFilled = this._fieldsFilled.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    let state: State = {
      showModal: nextProps.showModal,
    };

    this.setState(state);
    this.forceUpdate();
  }

  handleMessageChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  handleVolunteerPeriodSelection(daysToVolunteerForOption: SelectOption): void {
    this.setState({ daysToVolunteerForOption: daysToVolunteerForOption });
  }

  handleSubmit() {
    this.setState({ isSending: true });
    // TODO: Add metrics
    ProjectAPIUtils.post(
      "/volunteer/renew/" + this.props.applicationId + "/",
      {
        projectedEndDate: datetime.formatByStringUTC(
          datetime.addToDate(new Date(), {
            days: this.state.daysToVolunteerForOption.value,
          }),
          DateFormat.DATE_TIME_ZULU
        ),
        message: this.state.message,
      },
      response => this.closeModal(true),
      response => null /* TODO: Report error to user */
    );
  }

  closeModal(sent: boolean) {
    this.setState({
      isSending: false,
    });
    this.props.handleClose(sent);
  }

  render(): React$Node {
    return (
      <div>
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Volunteer Renewal Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  How long do you expect to be able to contribute to this
                  project?
                </Form.Label>
                {this._renderVolunteerPeriodDropdown()}
                <Form.Label>Message:</Form.Label>
                <div className="character-count">
                  {(this.state.message || "").length} / 3000
                </div>
                <Form.Control
                  as="textarea"
                  placeholder="Message for Project Owner (Optional)"
                  rows="4"
                  name="message"
                  maxLength="3000"
                  value={this.state.message}
                  onChange={this.handleMessageChange}
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
              onClick={this.handleSubmit}
            >
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  _fieldsFilled(): boolean {
    return this.state.daysToVolunteerForOption !== null;
  }

  _renderVolunteerPeriodDropdown(): React$Node {
    return (
      <Select
        options={volunteerPeriodsInDays}
        value={this.state.daysToVolunteerForOption}
        onChange={this.handleVolunteerPeriodSelection.bind(this)}
        simpleValue={true}
        isClearable={false}
        isMulti={false}
      />
    );
  }
}

export default ProjectVolunteerRenewModal;
