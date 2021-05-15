// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import { ReactSortable } from "react-sortablejs";

import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import { PositionInfo } from "./PositionInfo.jsx";
import PositionEntryModal from "./PositionEntryModal.jsx";
import GlyphStyles from "../utils/glyphs.js";
import _ from "lodash";

type Props = {|
  positions: $ReadOnlyArray<PositionInfo>,
  elementid: string,
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingPosition: PositionInfo,
  positionToDelete: number,
  positions: Array<PositionInfo>,
|};

/**
 * Lists project positions and provides add/edit functionality for them
 */
class PositionList extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      positions: this.props.positions || [],
      showAddEditModal: false,
      showDeleteModal: false,
      existingPosition: null,
      positionToDelete: null,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.positions) {
      this.setState({ positions: nextProps.positions || [] });
      this.updatePositionsField();
    }
  }

  savePositionOrdering(positions: $ReadOnlyArray<PositionInfo>): void {
    for (let i = 0; i < positions.length; ++i) {
      positions[i].orderNumber = i;
    }
    this.setState({ positions: positions }, this.updatePositionsField);
  }

  createNewPosition(): void {
    this.openModal(null);
  }

  onModalCancel(): void {
    this.setState({ showAddEditModal: false });
  }

  editPosition(position: PositionInfo): void {
    this.openModal(position);
  }

  toggleVisibility(position: PositionInfo): void {
    position.isHidden = !position.isHidden;
    this.setState({ position: position }, this.updatePositionsField);
  }

  savePosition(position: PositionInfo): void {
    if (!this.state.existingPosition) {
      this.state.positions.push(position);
      this.savePositionOrdering(this.state.positions);
    } else {
      _.assign(this.state.existingPosition, position);
    }

    this.setState({ showAddEditModal: false });
    this.updatePositionsField();
    this.props.onChange && this.props.onChange();
  }

  updatePositionsField(): void {
    if (this.refs && this.refs.hiddenFormField && this.state.positions) {
      const fieldValue: string = JSON.stringify(this.state.positions);
      this.refs.hiddenFormField.value = fieldValue;
    }
  }

  openModal(position: ?PositionInfo): void {
    this.setState({
      showAddEditModal: true,
      existingPosition: position,
    });
  }

  askForDeleteConfirmation(positionToDelete: number): void {
    this.setState({
      positionToDelete: positionToDelete,
      showDeleteModal: true,
    });
  }

  // TODO: Fix deleted positions popping back on the page as we proceed to next page
  confirmDelete(confirmed: boolean): void {
    if (confirmed) {
      this.state.positions.splice(this.state.positionToDelete, 1);
      this.updatePositionsField();
    }
    this.setState({
      showDeleteModal: false,
      positionToDelete: null,
    });
    this.props.onChange && this.props.onChange();
  }

  render(): React$Node {
    return (
      <div>
        <input
          type="hidden"
          ref="hiddenFormField"
          id={this.props.elementid}
          name={this.props.elementid}
        />
        <label>Roles Needed &nbsp;</label>
        <Button
          variant="primary"
          size="sm"
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
    return (
      <ReactSortable
        list={this.state.positions}
        setList={this.savePositionOrdering.bind(this)}
      >
        {this.state.positions.map((position: PositionInfo, i: number) =>
          this._renderPosition(position, i)
        )}
      </ReactSortable>
    );
  }

  _renderPosition(position: PositionInfo, i: number): React$Node {
    const positionDisplay =
      position.roleTag.subcategory + ":" + position.roleTag.display_name;
    const id: string = position.id || positionDisplay;
    return (
      <div key={id}>
        {position.descriptionUrl ? (
          <a
            href={position.descriptionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {positionDisplay}
          </a>
        ) : (
          <span>{positionDisplay}</span>
        )}
        <i
          className={GlyphStyles.Edit}
          aria-hidden="true"
          onClick={this.editPosition.bind(this, position)}
        ></i>
        <i
          className={GlyphStyles.Eye + (position.isHidden ? " dim" : "")}
          aria-hidden="true"
          onClick={this.toggleVisibility.bind(this, position)}
        ></i>
        <i
          className={GlyphStyles.Delete}
          aria-hidden="true"
          onClick={this.askForDeleteConfirmation.bind(this, i)}
        ></i>
      </div>
    );
  }
}

export default PositionList;
