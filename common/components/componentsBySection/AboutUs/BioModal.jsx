// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

type Props = {|
  showModal: boolean,
  biography: string,
  headerText: ?string,
  onClickButton: () => void
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
              <Modal.Header>
                {this.props.first_name} {this.props.last_name}
                {this.props.title}
              </Modal.Header>
              <Modal.Body style={{whiteSpace: "pre-wrap"}}>
                {this.props.biography}
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.closeModal.bind(this)}>Close</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default BioModal;
