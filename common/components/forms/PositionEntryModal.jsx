// @flow

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {TagDefinition} from "../utils/ProjectAPIUtils.js";
import TagSelector from "../common/tags/TagSelector.jsx";
import TagCategory from "../common/tags/TagCategory.jsx";
import {PositionInfo} from "./PositionInfo.jsx";
import url from "../utils/url.js";
import _ from 'lodash'

type Props = {|
  showModal: boolean,
  existingPosition: PositionInfo,
  onSavePosition: (PositionInfo) => void,
  onCancel: (void) => void
|};
type State = {|
  positionInfo: PositionInfo
|};

/**
 * Modal for adding/editing project positions
 */
class PositionEntryModal extends React.PureComponent<Props,State> {
  close: Function;
  save: Function;

  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      positionInfo: {
        roleTag: null,
        descriptionUrl: ""
      }
    };

    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
  }

  resetModal(existingPosition: ?PositionInfo): void {
    if(existingPosition) {
      this.setState({
        "positionInfo": _.cloneDeep(existingPosition)
      }, function() {this.forceUpdate();});
    } else {
      this.setState({
        "positionInfo": {
          roleTag: null,
          descriptionUrl: "",
          description: ""
        }
      });
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal },function() {
      this.resetModal(nextProps.existingPosition);
    });
  }

  close(): void {
    this.setState({showModal: false});
    this.props.onCancel();
  }

  save(): void {
    if(this.state.positionInfo.descriptionUrl) {
      this.state.positionInfo.descriptionUrl = url.appendHttpIfMissingProtocol(this.state.positionInfo.descriptionUrl);
    }
    this.props.onSavePosition(this.state.positionInfo);
    this.close();
  }

  onRoleChange(role: $ReadOnlyArray<TagDefinition>): void {
    this.state.positionInfo.roleTag = role[0];
    this.forceUpdate();
  }

  onDescriptionUrlChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.positionInfo.descriptionUrl = event.target.value;
    this.forceUpdate();
  }

  onDescriptionTextChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.positionInfo.description = event.target.value;
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.close}
          >
              <Modal.Header closeButton>
                  <Modal.Title>Role Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className="form-group">
                    <label htmlFor="project_technologies">Role</label>
                    <TagSelector
                      value={[this.state.positionInfo.roleTag]}
                      category={TagCategory.ROLE}
                      allowMultiSelect={false}
                      onSelection={this.onRoleChange.bind(this)}
                    />
                  </div>

                <div className="form-group">
                  <label htmlFor="position-description">
                    Position Description
                    { window.POSITION_DESCRIPTION_EXAMPLE_URL
                      ? (
                        <span className="modal-hint">
                          <a href={window.POSITION_DESCRIPTION_EXAMPLE_URL} rel="noopener noreferrer" target="_blank">
                            (Example template)
                          </a>
                        </span>)
                      : null
                    }
                  </label>
                  <div className="character-count">
                    { (this.state.positionInfo.description || "").length} / 3000
                  </div>
                  <textarea className="form-control" id="position-description" name="position-description"
                            placeholder="Describe the position's qualifications and responsibilities" rows="4" maxLength="3000"
                            value={this.state.positionInfo.description} onChange={this.onDescriptionTextChange.bind(this)}></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="link-position-description-url">Link to Description (Optional)</label>
                  <input type="text" className="form-control" id="link-position-description-url" maxLength="2075" value={this.state.positionInfo.descriptionUrl} onChange={this.onDescriptionUrlChange.bind(this)} placeholder="http://"/>
                </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="outline-secondary" onClick={this.close}>Close</Button>
                  <Button variant="dl-orange" disabled={!this.state.positionInfo.roleTag || !(this.state.positionInfo.descriptionUrl || this.state.positionInfo.description)}
                          onClick={this.save}>
                    Save
                  </Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default PositionEntryModal;
