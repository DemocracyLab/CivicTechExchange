// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  message: string,
  onSelection: (boolean) => void,
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal for getting yes/no confirmation
 */
class ConfirmationModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false
    }
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  
  confirm(confirmation: boolean): void {
    this.props.onSelection(confirmation);
  }
  
  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.confirm.bind(this, false)}
          >
              <Modal.Header >
                  <Modal.Title>Confirm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.props.message}
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.confirm.bind(this, false)}>No</Button>
                  <Button onClick={this.confirm.bind(this, true)}>Yes</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default ConfirmationModal;