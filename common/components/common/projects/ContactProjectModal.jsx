// @flow

import React from 'react';
import {Modal, Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js'


type Props = {|
  projectId: number,
  showModal: boolean,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string
|};

/**
 * Modal for sending messages to project owners
 */

class ContactProjectModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: ""
    }
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  

  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
      this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    this.setState({isSending:true});
    ProjectAPIUtils.post("/contact/project/" + this.props.projectId + "/",
      {message: this.state.message},
      response => this.closeModal(),
      response => null /* TODO: Report error to user */
      );
  }

  closeModal(){
    this.setState({isSending:false});
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.closeModal}
                 style={{paddingTop:'20%'}}
          >
              <Modal.Header >
                  <Modal.Title>Send message to Project Owner</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup>
                  <ControlLabel>Message:</ControlLabel>
                  <FormControl componentClass="textarea"
                    placeholder="Enter Message"
                    rows="4"
                    cols="50"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}/>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>{"Cancel"}</Button>
                <Button disabled={this.state.isSending} onClick={this.handleSubmit}>{this.state.isSending ? "Sending" : "Send"}</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default ContactProjectModal;