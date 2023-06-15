// @flow

import React from "react";
import metrics from "../../utils/metrics.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";

type Props = {|
  applicationId: number,
  showModal: boolean,
  handleClose: boolean => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: ?string,
|};

/**
 * Modal for concluding volunteer commitment
 */

class ProjectVolunteerConcludeModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props){
    let state: State = {
      showModal: nextProps.showModal,
    };

    return state;
  }

  handleMessageChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  handleSubmit() {
    this.setState({ isSending: true });
    // TODO: Add metrics
    ProjectAPIUtils.post(
      "/volunteer/conclude/" + this.props.applicationId + "/",
      {
        message: this.state.message,
      },
      response => this.closeModal(true),
      response => null /* TODO: Report error to user */
    );
  }

  closeModal(concluded: boolean) {
    this.setState({
      isSending: false,
    });
    this.props.handleClose(concluded);
  }

  render(): React$Node {
    return (
      <div>
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Conclude Volunteering</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
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
            <Button variant="primary" onClick={this.handleSubmit}>
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ProjectVolunteerConcludeModal;
