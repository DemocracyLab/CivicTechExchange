// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Glyph, GlyphSizes, GlyphStyles } from "../utils/glyphs.js";
import type { Dictionary } from "../types/Generics.jsx";

export const ModalSizes = {
  Small: "sm",
  Medium: "",
  Large: "lg",
  ExtraLarge: "xl",
};

type Props = {|
  showModal: boolean,
  headerText: string,
  cancelText: ?string,
  cancelEnabled: boolean,
  submitText: ?string,
  submitEnabled: boolean,
  onClickCancel: () => void,
  onClickSubmit: () => void,
  onModalHide: ?() => void,
  hideButtons: ?boolean,
  size: ?string,
  reverseCancelConfirm: ?boolean,
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

  static getDerivedStateFromProps(nextProps: Props){
    return { showModal: nextProps.showModal };
  }

  render(): React$Node {
    const modalProps: Dictionary<string> = {
      show: this.props.showModal,
      onHide: this.props.onModalHide || this.props.onClickCancel,
    };
    if (this.props.size) {
      modalProps.size = this.props.size;
    }
    return (
      <div>
        <Modal {...modalProps}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{this.props.headerText}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.children}</Modal.Body>
          {!this.props.hideButtons && (
            <Modal.Footer>
              {this.props.reverseCancelConfirm ? (
                <React.Fragment>
                  {this._renderSubmitButton()}
                  {this.props.onClickCancel && this._renderCancelButton()}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.props.onClickCancel && this._renderCancelButton()}
                  {this._renderSubmitButton()}
                </React.Fragment>
              )}
            </Modal.Footer>
          )}
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
