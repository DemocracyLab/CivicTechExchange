// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalWrapper from "./ModalWrapper.jsx";

type Props = {|
  showModal: boolean,
  headerText: string,
  requireMessage: boolean,
  messagePrompt: string,
  confirmButtonText: string,
  confirmProcessingButtonText: string,
  maxCharacterCount: number,
  onSelection: (boolean, string) => Promise<any>,
  onConfirmOperationComplete: ?() => void,
|};
type State = {|
  showModal: boolean,
  feedbackText: string,
  isProcessing: boolean,
|};

/**
 * Generic Modal designed to solicit feedback
 */
class FeedbackModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      feedbackText: "",
      isProcessing: false,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return { showModal: nextProps.showModal };
  }

  onTextChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.feedbackText = event.target.value;
    this.forceUpdate();
  }

  confirm(confirmation: boolean): void {
    if (confirmation) {
      this.setState({ isProcessing: true });
      const confirmAction: Promise<any> = this.props
        .onSelection(confirmation, this.state.feedbackText)
        .then(() => {
          this.setState({ feedbackText: "", isProcessing: false });
        });
      if (this.props.onConfirmOperationComplete) {
        confirmAction.then(this.props.onConfirmOperationComplete);
      }
    } else {
      this.setState(
        { feedbackText: "", isProcessing: false },
        this.props.onConfirmOperationComplete()
      );
    }
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <ModalWrapper
          headerText={this.props.headerText}
          showModal={this.state.showModal}
          submitText={
            this.state.isProcessing
              ? this.props.confirmProcessingButtonText
              : this.props.confirmButtonText
          }
          cancelText="Cancel"
          cancelEnabled={!this.state.isProcessing}
          submitEnabled={
            !this.state.isProcessing &&
            (!this.props.requireMessage || this.state.feedbackText)
          }
          onClickCancel={this.confirm.bind(this, false)}
          onClickSubmit={this.confirm.bind(this, true)}
        >
          {this.props.messagePrompt}
          <div className="character-count">
            {(this.state.feedbackText || "").length} /{" "}
            {this.props.maxCharacterCount}
          </div>
          <textarea
            className="form-control"
            rows="4"
            maxLength={this.props.maxCharacterCount}
            value={this.state.feedbackText}
            onChange={this.onTextChange.bind(this)}
          ></textarea>
        </ModalWrapper>
      </React.Fragment>
    );
  }
}

export default FeedbackModal;
