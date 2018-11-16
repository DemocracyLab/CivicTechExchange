// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx'
import {PositionInfo} from "./PositionInfo.jsx";
import PositionEntryModal from "./PositionEntryModal.jsx";
import GlyphStyles from "../utils/glyphs.js";
import _ from 'lodash'


type Props = {|
  positions: $ReadOnlyArray<PositionInfo>,
  elementid: string
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingPosition: PositionInfo,
  positionToDelete: number,
  positions: Array<PositionInfo>
|};

/**
 * Lists project positions and provides add/edit functionality for them
 */
class PositionList extends React.PureComponent<Props,State>  {
  constructor(props: Props): void {
    super(props);
    this.state = {
      positions: this.props.positions || [],
      showAddEditModal: false,
      showDeleteModal: false,
      existingPosition: null,
      positionToDelete: null
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.positions) {
      this.setState({positions: nextProps.positions || []});
      this.updatePositionsField();
    }
  }

  createNewPosition(): void {
    this.openModal(null);
  }

  onModalCancel(): void {
    this.setState({showAddEditModal: false})
  }

  editPosition(position: PositionInfo): void {
    this.openModal(position);
  }

  savePosition(position: PositionInfo): void {
    if(!this.state.existingPosition) {
      this.state.positions.push(position);
    } else {
      _.assign(this.state.existingPosition, position);
    }

    this.setState({showAddEditModal: false});
    this.updatePositionsField();
  }

  updatePositionsField(): void {
    this.refs.hiddenFormField.value = JSON.stringify(this.state.positions);
  }

  openModal(position: ?PositionInfo): void {
    this.setState({
      showAddEditModal: true,
      existingPosition: position
    });
  }

  askForDeleteConfirmation(positionToDelete: number): void {
    this.setState({
      positionToDelete: positionToDelete,
      showDeleteModal: true
    })
  }

  confirmDelete(confirmed: boolean): void {
    if(confirmed) {
      this.state.positions.splice(this.state.positionToDelete, 1);
      this.updatePositionsField();
    }
    this.setState({
      showDeleteModal: false,
      positionToDelete: null
    })
  }

  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} name={this.props.elementid}/>
        <label>Roles Needed &nbsp;</label>
        <Button
          className="btn-background-project"
          bsSize="small"
          onClick={this.createNewPosition.bind(this)}
        >
          <i className={GlyphStyles.Add} aria-hidden="true"></i>
        </Button>

        {this._renderPositions()}

        <PositionEntryModal
          showModal={this.state.showAddEditModal}
          existingPosition={this.state.existingPosition}
          onSavePosition={this.savePosition.bind(this)}
          onCancel={this.onModalCancel.bind(this)}
        />

        <ConfirmationModal
          showModal={this.state.showDeleteModal}
          message="Do you want to delete this position?"
          onSelection={this.confirmDelete.bind(this)}
        />
      </div>
    );
  }

  _renderPositions(): Array<React$Node> {
    return this.state.positions.map((position,i) => {
      const positionDisplay = position.roleTag.subcategory + ":" + position.roleTag.display_name;
      return (
        <div key={i}>
          {
            position.descriptionUrl
            ? <a href={position.descriptionUrl} target="_blank" rel="noopener noreferrer">{positionDisplay}</a>
            : <span>{positionDisplay}</span>
          }
          <i className={GlyphStyles.Edit} aria-hidden="true" onClick={this.editPosition.bind(this, position)}></i>
          <i className={GlyphStyles.Delete} aria-hidden="true" onClick={this.askForDeleteConfirmation.bind(this, i)}></i>
        </div>
      )
    });
  }
}

export default PositionList;
