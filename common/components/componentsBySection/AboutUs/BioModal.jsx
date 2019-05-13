// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  biography: string,
  headerText: ?string,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal for surfacing notifications
 */
class BioModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false
    }
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  closeModal(): void {
    this.setState({showModal:false});
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal} onHide={this.closeModal}>
              <Modal.Header>
                <button className='about-us-modal-closebutton' onClick={this.closeModal}>CLOSE</button>
                firstname lastname <br />
                title
              </Modal.Header>
              <Modal.Body style={{whiteSpace: "pre-wrap"}}>
                words words words words words words words words words words words words words words words words words words words words words words
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.closeModal}>Close</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default BioModal;
