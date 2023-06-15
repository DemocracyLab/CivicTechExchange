// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ModalSizes } from "../ModalWrapper.jsx";
import type { Dictionary } from "../../types/Generics.jsx";

type Props = {|
  showModal: boolean,
  message: ?string, // If message not included, use props.children instead
  buttonText: string,
  headerText: ?string,
  onClickButton: () => void,
  size: ?string,
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

  static getDerivedStateFromProps(nextProps: Props, state){
    return{ showModal: nextProps.showModal };
  }

  closeModal(): void {
    this.setState({ showModal: false });
    this.props.onClickButton();
  }

  render(): React$Node {
    // TODO: Use ModalWrapper
    const sizeProp: Dictionary<string> =
      "size" in this.props
        ? { size: this.props.size }
        : { size: ModalSizes.Large };
    return (
      <div>
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this)}
          {...sizeProp}
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
