// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import ContactForm from "./ContactForm.jsx";

type Props = {|
  showModal: boolean,
  onSubmit: () => void,
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
|};

/**
 * Modal for contacting democracylab
 */

class ContactUsModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    let state: State = {
      showModal: nextProps.showModal,
    };

    this.setState(state);
    this.forceUpdate();
  }

  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.setState({ message: event.target.value });
  }

  handleSubmit() {
    this.setState(
      {
        isSending: true,
      },
      this.props.onSubmit
    );
  }

  closeModal(submitted: boolean): void {
    this.setState(
      {
        isSending: false,
      },
      this.props.onSubmit
    );
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this, false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Contact DemocracyLab</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContactForm showCompany={true} onSubmit={this.handleSubmit} />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ContactUsModal;
