// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import formHelper from "../../utils/forms.js";
import promiseHelper from "../../utils/promise.js";
import _ from "lodash";

export type ContactModalFields = {|
  subject: ?string,
  message: string,
|};

type Props = {|
  headerText: string,
  explanationText: string,
  messagePlaceholderText: string,
  showSubject: ?boolean,
  showModal: boolean,
  handleClose: () => void,
  handleSubmission: (ContactModalFields, () => void) => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  formFields: ContactModalFields,
  showConfirmationModal: boolean,
|};

/**
 * Modal for sending messages to individuals
 */

class ContactModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      formFields: {
        subject: "",
        message: "",
      },
      showConfirmationModal: false,
    };
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);

    this.form = formHelper.setup();
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    // TODO: Erase fields
    return { showModal: nextProps.showModal };
  }

  askForSendConfirmation(): void {
    this.setState({ showConfirmationModal: true });
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
    this.props.handleSubmission(this.state.formFields, this.closeModal);
  }

  closeModal() {
    this.setState({ isSending: false });
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
        <ConfirmationModal
          showModal={this.state.showConfirmationModal}
          message="Do you want to send this?"
          onSelection={this.receiveSendConfirmation}
        />
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.headerText}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.props.explanationText}</p>
            {this.props.showSubject ? this._renderSubjectLineBox() : null}
            <Form>
              <Form.Group>
                <Form.Label>Message:</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder={this.props.messagePlaceholderText}
                  rows="4"
                  name="message"
                  value={this.state.formFields.message}
                  onChange={this.form.onInput.bind(this, "message")}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.closeModal}>
              {"Cancel"}
            </Button>
            <Button
              variant="primary"
              disabled={
                this.state.isSending || _.isEmpty(this.state.formFields.message)
              }
              onClick={this.askForSendConfirmation}
            >
              {this.state.isSending ? "Sending" : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  _renderSubjectLineBox(): React$Node {
    return (
      <Form>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          componentClass="input"
          name="subject"
          maxLength="60"
          value={this.state.formFields.subject}
          onChange={this.form.onInput.bind(this, "subject")}
        />
      </Form>
    );
  }
}

export default ContactModal;
