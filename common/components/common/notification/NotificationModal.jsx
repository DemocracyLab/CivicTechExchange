// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type Props = {|
  showModal: boolean,
  message: ?string, // If message not included, use props.children instead
  buttonText: string,
  headerText: ?string,
  onClickButton: () => void,
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal for surfacing notifications
 */
class NotificationModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  closeModal(): void {
    this.setState({ showModal: false });
    this.props.onClickButton();
  }

  render(): React$Node {
    return (
      <div>
        <Modal
          show={this.state.showModal}
          size="lg"
          onHide={this.closeModal.bind(this)}
        >
          <Modal.Header style={{ whiteSpace: "pre-wrap" }} closeButton>
            <Modal.Title>{this.props.headerText}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ whiteSpace: "pre-wrap" }}>
            {this.props.message ? this.props.message : this.props.children}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeModal.bind(this)}>
              {this.props.buttonText}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NotificationModal;
