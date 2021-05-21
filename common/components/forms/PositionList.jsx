// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import { ReactSortable } from "react-sortablejs";

import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import { PositionInfo } from "./PositionInfo.jsx";
import PositionEntryModal from "./PositionEntryModal.jsx";
import { GlyphStyles } from "../utils/glyphs.js";
import PositionListEntry from "./PositionListEntry.jsx";
import promiseHelper from "../utils/promise.js";
import _ from "lodash";

export type NewPositionInfo = PositionInfo & {| tempId: ?number |};

type Props = {|
  positions: $ReadOnlyArray<PositionInfo>,
  elementid: string,
|};
type State = {|
  positionsInitialized: boolean,
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  showHideModal: boolean,
  existingPosition: ?NewPositionInfo,
  selectedPosition: ?NewPositionInfo,
  positionToActUpon: ?NewPositionInfo,
  positions: Array<NewPositionInfo>,
|};

type OnChooseEvent = Event & {| oldIndex: number |};

/**
 * Lists project positions and provides add/edit functionality for them
 */
class PositionList extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const positions: $ReadOnlyArray<NewPositionInfo> =
      this.props.positions || [];
    this.state = {
      positions: positions,
      positionsInitialized: !_.isEmpty(positions),
      selectedPosition: null,
      showAddEditModal: false,
      showDeleteModal: false,
      showHideModal: false,
      existingPosition: null,
      positionToActUpon: null,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      !this.state.positionsInitialized &&
      nextProps.positions !== this.state.positions
    ) {
      this.setState({
        positions: nextProps.positions || [],
        positionsInitialized: !_.isEmpty(nextProps.positions),
      });
      this.updatePositionsField();
    }
  }

  savePositionOrdering(positions: $ReadOnlyArray<NewPositionInfo>): void {
    for (let i = 0; i < positions.length; ++i) {
      positions[i].orderNumber = i;
    }
    this.setState(
      { positions: positions, selectedPosition: this.state.selectedPosition },
      this.updatePositionsField
    );
  }

  createNewPosition(): void {
    this.openModal(null);
  }

  onModalCancel(): void {
    this.setState({ showAddEditModal: false });
  }

  editPosition(position: NewPositionInfo): void {
    this.openModal(position);
  }

  toggleVisibility(position: NewPositionInfo): void {
    if (!position.isHidden) {
      this.setState({ showHideModal: true, positionToActUpon: position });
    } else {
      position.isHidden = false;
      this.savePositionOrdering(this.state.positions.slice());
    }
  }

  savePosition(position: NewPositionInfo): void {
    if (!this.state.existingPosition) {
      // We need a temporary id for keying, until such time as the position is saved
      position.tempId = _.random(Number.MAX_VALUE);
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

  openModal(position: ?NewPositionInfo): void {
    this.setState({
      showAddEditModal: true,
      existingPosition: position,
    });
  }

  askForDeleteConfirmation(positionToDelete: NewPositionInfo): void {
    this.setState({
      positionToActUpon: positionToDelete,
      showDeleteModal: true,
    });
  }

  // TODO: Fix deleted positions popping back on the page as we proceed to next page
  confirmDelete(confirmed: boolean): void {
    return promiseHelper.promisify(() => {
      const state: State = {
        showDeleteModal: false,
        positionToActUpon: null,
      };
      if (confirmed) {
        state.positions = this.state.positions.slice();
        _.remove(state.positions, (p: NewPositionInfo) =>
          this.state.positionToActUpon.tempId
            ? p.tempId === this.state.positionToActUpon.tempId
            : p.id === this.state.positionToActUpon.id
        );
      }
      this.setState(state, this.updatePositionsField);
      this.props.onChange && this.props.onChange();
    });
  }

  confirmHide(confirmed: boolean): void {
    return promiseHelper.promisify(() => {
      const state: State = {
        showHideModal: false,
        positionToActUpon: null,
      };
      if (confirmed) {
        this.state.positionToActUpon.isHidden = true;
        state.positions = this.state.positions.slice();
      }
      this.setState(state, this.updatePositionsField);
      this.props.onChange && this.props.onChange();
    });
  }

  onChoose(evt: OnChooseEvent): void {
    this.setState({ selectedPosition: this.state.positions[evt.oldIndex] });
  }

  onUnchoose(evt: OnChooseEvent): void {
    this.setState({ selectedPosition: null });
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

        <div className="orderInstructions">
          <p>Volunteer roles will be listed in the order shown below.</p>
          <p className="dragRoleInstructions">Drag each role to rearrange.</p>
        </div>

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

        <ConfirmationModal
          showModal={this.state.showHideModal}
          message="Do you want to hide this position?"
          onSelection={this.confirmHide.bind(this)}
        />
      </div>
    );
  }

  _renderPositions(): Array<React$Node> {
    return (
      <ReactSortable
        list={this.state.positions}
        setList={this.savePositionOrdering.bind(this)}
        onChoose={this.onChoose.bind(this)}
        onUnchoose={this.onUnchoose.bind(this)}
        animation={200}
        delayOnTouchStart={true}
        delay={2}
      >
        {this.state.positions.map((position: NewPositionInfo, i: number) => {
          const selected: boolean =
            this.state.selectedPosition &&
            (position.tempId
              ? position.tempId === this.state.selectedPosition.tempId
              : position.id === this.state.selectedPosition.id);
          return (
            <PositionListEntry
              position={position}
              selected={selected}
              onClickEditPosition={this.editPosition.bind(this, position)}
              onClickToggleVisibility={this.toggleVisibility.bind(
                this,
                position
              )}
              onClickDelete={this.askForDeleteConfirmation.bind(this, position)}
            />
          );
        })}
      </ReactSortable>
    );
  }
}

export default PositionList;
