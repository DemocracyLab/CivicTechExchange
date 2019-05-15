// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Glyph, GlyphStyles, GlyphSizes} from '../../utils/glyphs.js';
import _ from 'lodash';

type Props = {|
  showModal: boolean,
  title: string,
  size: string,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
|};


const defaultBiography = "This user hasn't provided us with a biography yet. But trust me, when they do it'll be awesome.";

/**
 * Modal for showing user biography details
 */
class BioModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
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
    return this.props.person && (
      <div>
          <Modal show={this.state.showModal} onHide={this.closeModal} bsSize={this.props.size} className="bio-modal-root">
              <Modal.Header>
                <div className="bio-modal-nametitle-container">
                  <h4 className="bio-modal-name"><a href={"/index/?section=Profile&id=" + this.props.person.id}>{this.props.person.first_name} {this.props.person.last_name}</a></h4>
                  <h5 className="bio-modal-title">{this.props.title}</h5>
                </div>
                <i className={Glyph(GlyphStyles.Close, GlyphSizes.X2)} onClick={this.closeModal}></i>
              </Modal.Header>
              <Modal.Body style={{whiteSpace: "pre-wrap"}}>
                <h5 className="bio-modal-about">About</h5>
                <p>{!_.isEmpty(this.props.person.about_me) ? this.props.person.about_me : defaultBiography}</p>
              </Modal.Body>
          </Modal>
      </div>
    );
  }
}

export default BioModal;
