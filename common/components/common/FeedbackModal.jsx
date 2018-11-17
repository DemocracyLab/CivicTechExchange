// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  headerText: string,
  requireMessage: boolean,
  messagePrompt: string,
  confirmButtonText: string,
  maxCharacterCount: number,
  onConfirm: (boolean, string) => void,
|};
type State = {|
  showModal: boolean,
  feedbackText: string
|};

/**
 * Generic Modal designed to solicit feedback
 */
class FeedbackModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      feedbackText: ""
    }
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  
  onTextChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.feedbackText = event.target.value;
    this.forceUpdate();
  }
  
  confirm(confirmation: boolean): void {
    this.props.onConfirm(confirmation, this.state.feedbackText);
  }
  
  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.confirm.bind(this, false)}
          >
              <Modal.Header >
                  <Modal.Title>{this.props.headerText}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.props.messagePrompt}
                <div className="character-count">
                  { (this.state.feedbackText || "").length} / {this.props.maxCharacterCount}
                </div>
                <textarea className="form-control" rows="4" maxLength={this.props.maxCharacterCount} value={this.state.feedbackText}
                          onChange={this.onTextChange.bind(this)}>
                </textarea>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.confirm.bind(this, false)}>Cancel</Button>
                  <Button disabled={this.props.requireMessage && !this.state.feedbackText} onClick={this.confirm.bind(this, true)}>
                    {this.props.confirmButtonText}
                  </Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default FeedbackModal;