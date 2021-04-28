// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalWrapper from "../ModalWrapper.jsx";

type Props = {|
  showModal: boolean,
  message: string,
  onSelection: boolean => Promise<any>,
  onConfirmOperationComplete: ?() => void,
|};
type State = {|
  showModal: boolean,
  isProcessing: boolean,
|};

/**
 * Modal for getting yes/no confirmation
 */
class ConfirmationModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  confirm(confirmation: boolean): void {
    if (confirmation) {
      this.setState({ isProcessing: true });
      const confirmAction: Promise<any> = this.props
        .onSelection(confirmation)
        .then(() => {
          this.setState({ isProcessing: false });
        });
      if (this.props.onConfirmOperationComplete) {
        confirmAction.then(this.props.onConfirmOperationComplete);
      }
    } else {
      if (this.props.onConfirmOperationComplete) {
        this.setState(
          { isProcessing: false },
          this.props.onConfirmOperationComplete
        );
      } else {
        this.setState({ isProcessing: false });
      }
    }
  }

  render(): React$Node {
    return (
      <ModalWrapper
        showModal={this.state.showModal}
        headerText="Confirm"
        cancelText="No"
        cancelEnabled={!this.state.isProcessing}
        submitText={this.state.isProcessing ? "" : "Yes"}
        submitEnabled={!this.state.isProcessing}
        onClickCancel={this.confirm.bind(this, false)}
        onClickSubmit={this.confirm.bind(this, true)}
      >
        {this.props.message}
      </ModalWrapper>
    );
  }
}

export default ConfirmationModal;
