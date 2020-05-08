// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ConfirmationModal from '../../common/confirmation/ConfirmationModal.jsx';
import form from "../../utils/forms.js";
import _ from "lodash";

export type ContactModalFields = {|
  subject: ?string,
  message: string
|}

type Props = {|
  headerText: string,
  explanationText: string,
  messagePlaceholderText: string,
  showSubject: ?boolean,
  showModal: boolean,
  handleClose: () => void,
  handleSubmission: (ContactModalFields, () => void) => void
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  formFields: ContactModalFields,
  showConfirmationModal: boolean
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
        message: ""
      },
      showConfirmationModal: false
    };
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);

    this.form = form.setup();
  }

  componentWillReceiveProps(nextProps: Props): void {
    // TODO: Erase fields
    this.setState({ showModal: nextProps.showModal });
  }

  askForSendConfirmation(): void {
    this.setState({showConfirmationModal:true});
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit();
    }
    this.setState({showConfirmationModal: false});
  }

  handleSubmit() {
    this.setState({isSending: true});
    this.props.handleSubmission(this.state.formFields, this.closeModal);
  }

  closeModal(){
    this.setState({isSending:false});
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
          <Modal show={this.state.showModal}
                 onHide={this.closeModal}
          >
              <Modal.Header >
                  <Modal.Title>{this.props.headerText}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{this.props.explanationText}</p>
                {this.props.showSubject ? this._renderSubjectLineBox() : null}
                <Form>
                  <Form.Group>
                    <Form.Label>Message:</Form.Label>
                    <Form.Control as="textarea"
                      placeholder={this.props.messagePlaceholderText}
                      rows="4"
                      cols="50"
                      name="message"
                      value={this.state.formFields.message}
                      onChange={this.form.onInput.bind(this, "message")}/>
                    </Form.Group>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>{"Cancel"}</Button>
                <Button disabled={this.state.isSending || _.isEmpty(this.state.formFields.message)} onClick={this.askForSendConfirmation}>{this.state.isSending ? "Sending" : "Send"}</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }

  _renderSubjectLineBox(): React$Node {
    return (
      <FormGroup>
        <ControlLabel>Subject</ControlLabel>
        <FormControl componentClass="input" name="subject" maxLength="60"
               value={this.state.formFields.subject} onChange={this.form.onInput.bind(this, "subject")}/>
      </FormGroup>
    );
  }
}

export default ContactModal;
