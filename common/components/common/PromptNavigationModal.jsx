// @flow

import React from "react";
import ModalWrapper from "./ModalWrapper.jsx";

type Props = {|
  showModal: boolean,
  submitUrl: string,
  cancelText: ?string,
  headerText: ?string,
  submitText: ?string,
  onCancel: () => void,
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal prompting users to go to a location
 */
class PromptNavigationModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: props.showModal,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return { showModal: nextProps.showModal };
  }

  confirm(confirmed: boolean): void {
    if (confirmed) {
      window.location.href = this.props.submitUrl;
    } else {
      this.props.onCancel();
    }
  }

  render(): React$Node {
    return (
      <ModalWrapper
        showModal={this.state.showModal}
        headerText={this.props.headerText}
        cancelText={this.props.cancelText}
        cancelEnabled={true}
        submitText={this.props.submitText}
        submitEnabled={true}
        onClickCancel={this.confirm.bind(this, false)}
        onClickSubmit={this.confirm.bind(this, true)}
      >
        {this.props.children}
      </ModalWrapper>
    );
  }
}

export default PromptNavigationModal;
