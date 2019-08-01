// @flow

import React from 'react';
import {Modal, Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import ConfirmationModal from '../../common/confirmation/ConfirmationModal.jsx';

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
  subject: string,
  message: string,
  showConfirmationModal: boolean
|};

/**
 * Modal for sending messages to individuals
 */

class ContactProjectModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: "",
      showConfirmationModal: false
    };
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }


  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
      this.setState({message: event.target.value});
  }

  askForSendConfirmation(): void {
    this.setState({showConfirmationModal:true});
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit()
    }
    this.setState({showConfirmationModal: false});
  }

  handleSubmit() {
    this.setState({isSending: true});
    this.props.handleSubmission({message: this.state.message}, this.closeModal);
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
                <FormGroup>
                  <ControlLabel>Message:</ControlLabel>
                  <FormControl componentClass="textarea"
                    placeholder={this.props.messagePlaceholderText}
                    rows="4"
                    cols="50"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}/>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>{"Cancel"}</Button>
                <Button disabled={this.state.isSending} onClick={this.askForSendConfirmation}>{this.state.isSending ? "Sending" : "Send"}</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default ContactProjectModal;
