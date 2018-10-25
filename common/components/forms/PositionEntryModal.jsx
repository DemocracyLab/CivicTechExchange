// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';
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
      });
      this.forceUpdate();
    } else {
      this.setState({
        "positionInfo": {
          roleTag: null,
          descriptionUrl: ""
        }
      });
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
    this.resetModal(nextProps.existingPosition);
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

  onDescriptionChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.positionInfo.descriptionUrl = event.target.value;
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.close}
          >
              <Modal.Header>
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
                  <label htmlFor="link-position-description">Link to Description <span className="modal-hint"><a href="https://docs.google.com/document/d/142NH4uRblJP6XvKdmW4GiFwoOmVWY6BJfEjGrlSP3Uk/edit" rel="noopener noreferrer" target="_blank">(Example template)</a></span></label>
                  <input type="text" className="form-control" id="link-position-description" maxLength="2075" value={this.state.positionInfo.descriptionUrl} onChange={this.onDescriptionChange.bind(this)} placeholder="http://"/>
                </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.close}>Close</Button>
                  <Button disabled={!this.state.positionInfo.roleTag} onClick={this.save}>Save</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default PositionEntryModal;
