// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  message: string,
  buttonText: string,
  headerText: ?string,
  onClickButton: () => void
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
      showModal: false
    }
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  
  closeModal(): void {
    this.setState({showModal:false});
    this.props.onClickButton();
  }
  
  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal} className="wide-dialog">
              <Modal.Header style={{whiteSpace: "pre-wrap"}}>
                  <Modal.Title>{this.props.headerText}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{whiteSpace: "pre-wrap"}}>
                {this.props.message}
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.closeModal.bind(this)}>{this.props.buttonText}</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default NotificationModal;