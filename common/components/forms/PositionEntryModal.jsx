// @flow

import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {TagDefinition} from "../utils/ProjectAPIUtils.js";
import TagSelector from "../common/tags/TagSelector.jsx";
import TagCategory from "../common/tags/TagCategory.jsx";
import {PositionInfo} from "./PositionInfo.jsx";
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
        description: ""
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
          description: ""
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
    this.props.onSavePosition(this.state.positionInfo);
    this.close();
  }
  
  onRoleChange(role: $ReadOnlyArray<TagDefinition>): void {
    this.state.positionInfo.roleTag = role[0];
    this.forceUpdate();
  }
  
  onDescriptionChange(event: SyntheticInputEvent<HTMLInputElement>): void {
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
                  <Modal.Title>Position Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className="form-group">
                    <label htmlFor="project_technologies">Position</label>
                    <TagSelector
                      value={[this.state.positionInfo.roleTag]}
                      category={TagCategory.ROLE}
                      allowMultiSelect={false}
                      onSelection={this.onRoleChange.bind(this)}
                    />
                  </div>
  
                <div className="form-group">
                  <div className="character-count">
                    { (this.state.positionInfo.description || "").length} / 3000
                  </div>
                  <textarea className="form-control"
                            placeholder="Describe the position's qualifications and responsibilities" rows="3" maxLength="3000"
                            value={this.state.positionInfo.description} onChange={this.onDescriptionChange.bind(this)}></textarea>
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