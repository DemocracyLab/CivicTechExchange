// @flow

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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


 /* Modal for showing user biography details */
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

  defaultBiography(): void {
    return `${this.props.person.first_name} ${this.props.person.last_name} is contributing their talents to DemocracyLab, helping to empower a community of people and projects that use technology to advance the public good.`;
  }

  render(): React$Node {
    return this.props.person && (
      <div>
          <Modal show={this.state.showModal} onHide={this.closeModal} size={this.props.size} className="bio-modal-root">
              <Modal.Header>
                <div className="bio-modal-nametitle-container">
                  <h4 className="bio-modal-name"><a href={"/index/?section=Profile&id=" + this.props.person.id}>{this.props.person.first_name} {this.props.person.last_name}</a></h4>
                  <h5 className="bio-modal-title">{this.props.title}</h5>
                </div>
                <i className={Glyph(GlyphStyles.Close, GlyphSizes.X2)} onClick={this.closeModal}></i>
              </Modal.Header>
              <Modal.Body style={{whiteSpace: "pre-wrap"}}>
                <h5 className="bio-modal-about">About</h5>
                <p>{!_.isEmpty(this.props.person.about_me) ? this.props.person.about_me : this.defaultBiography()}</p>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.closeModal} className="btn btn-secondary">Close</button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default BioModal;
