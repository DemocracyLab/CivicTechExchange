// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Glyph, GlyphSizes, GlyphStyles } from "../utils/glyphs";
type Props = {|
  showModal: boolean,
  headerText: string,
  cancelText: ?string,
  cancelEnabled: boolean,
  submitText: ?string,
  submitEnabled: boolean,
  onClickCancel: () => void,
  onClickSubmit: () => void,
|};
type State = {||};

/**
 * Wrapper for Bootstrap Modal
 */
class ModalWrapper extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  render(): React$Node {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.onClickCancel}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{this.props.headerText}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.children}</Modal.Body>
          <Modal.Footer>
            {this.props.onClickCancel && this._renderCancelButton()}
            {this._renderSubmitButton()}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  _renderCancelButton(): React$Node {
    return (
      <Button
        variant="outline-secondary"
        onClick={() => this.props.onClickCancel()}
        disabled={!this.props.cancelEnabled}
      >
        {this.props.cancelText || "Cancel"}
      </Button>
    );
  }

  _renderSubmitButton(): React$Node {
    // TODO: Figure out more visually pleasing spinner solution
    const buttonContent: React$Node = this.props.submitText ? (
      <React.Fragment>{this.props.submitText}</React.Fragment>
    ) : (
      <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.SM)}></i>
    );
    return (
      <Button
        variant="primary"
        disabled={!this.props.submitEnabled}
        onClick={() => this.props.onClickSubmit()}
      >
        {buttonContent}
      </Button>
    );
  }
}

export default ModalWrapper;
