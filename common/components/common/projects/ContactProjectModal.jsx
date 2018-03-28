// @flow

import React from 'react';
import {Modal, Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  handleClose: () => void,
|};
type State = {|
  showModal: boolean,
  message: string,
  email: string
|};

/**
 * Modal for sending messages to project owners
 */

class ContactProjectModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      message: "",
      email: ""
    }
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  

  handleChange(event) {
    if(event.target.name === "message") {
      this.setState({message: event.target.value});
    } 
    if(event.target.name === "email") {
     this.setState({email: event.target.value});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  closeModal(handleClose){
    handleClose();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.closeModal.bind(this)}
                 style={{paddingTop:'20%'}}
          >
              <Modal.Header >
                  <Modal.Title>Send us a message!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={this.handleSubmit}>
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
                  <FormGroup>
                    <ControlLabel>Email address:</ControlLabel>
                    <FormControl
                      id="formControlsEmail"
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" value="Submit">Submit</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default ContactProjectModal;