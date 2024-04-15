// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalWrapper from "./ModalWrapper.jsx";

type Props = {|
  showModal: boolean,
  headerText: ?string,
  message: string,
  cancelText: ?string,
  submitText: ?string,
  onSelection: boolean => Promise < any >,
  onContinueOperationComplete: ?() => void,
|};
type State = {|
  showModal: boolean,
  isProcessing: boolean,
|};

class WarningModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  continue(canContinue: boolean): void {
    this.setState({ isProcessing: true });
    const continueAction: Promise<any> = this.props
      .onSelection(canContinue)
      .then(() => {
        this.setState({ isProcessing: false });
        this.forceUpdate();
      });
    if (this.props.onContinueOperationComplete) {
      continueAction.then(this.props.onContinueOperationComplete);
    }
  }

  render(): React$Node {
    return (
      <ModalWrapper
        showModal={this.state.showModal}
        headerText={this.props.headerText || "Warning"}
        cancelText={this.state.isProcessing ? "" : this.props.cancelText || "Allow"}
        cancelEnabled={!this.state.isProcessing}
        submitText={this.state.isProcessing ? "" : this.props.submitText || "Abort"}
        submitEnabled={!this.state.isProcessing}
        onClickCancel={this.continue.bind(this, true)}
        onClickSubmit={this.continue.bind(this, false)}
        onModalHide={this.continue.bind(this, false)}
      >
        {this.props.message}
      </ModalWrapper>
    );
  }
}

export default WarningModal;