// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import { ReactSortable } from "react-sortablejs";
import { Container } from "flux/utils";
import _ from "lodash";

import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import { PositionInfo } from "./PositionInfo.jsx";
import PositionEntryModal from "./PositionEntryModal.jsx";
import { GlyphStyles } from "../utils/glyphs.js";
import PositionListEntry from "./PositionListEntry.jsx";
import promiseHelper from "../utils/promise.js";
import FormFieldsStore from "../stores/FormFieldsStore.js";
import HiddenFormFields from "./HiddenFormFields.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import type { Dictionary } from "../types/Generics.jsx";

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
  positionsJson: string,
|};

type OnChooseEvent = Event & {| oldIndex: number |};

/**
 * Lists project positions and provides add/edit functionality for them
 */
class PositionList extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      selectedPosition: null,
      showAddEditModal: false,
      showDeleteModal: false,
      showHideModal: false,
      existingPosition: null,
      positionToActUpon: null,
    };

    this.updatePositionsField = this.updatePositionsField.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    const formFields: Dictionary<any> = FormFieldsStore.getFormFieldValues();
    if (!_.isEmpty(formFields[props.elementid])) {
      state.positions = formFields[props.elementid];
      state.positionsJson = JSON.stringify(state.positions);
    }

    return state;
  }

  savePositionOrdering(positions: $ReadOnlyArray<NewPositionInfo>): void {
    for (let i = 0; i < positions.length; ++i) {
      positions[i].orderNumber = i;
    }
    this.setState(
      Object.assign(this.updatePositionsField(positions), {
        selectedPosition: this.state.selectedPosition,
      })
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
    const positions: Array<NewPositionInfo> = this.state.positions || [];
    if (!this.state.existingPosition) {
      // We need a temporary id for keying, until such time as the position is saved
      position.tempId = _.random(Number.MAX_VALUE);
      positions.unshift(position);
      this.savePositionOrdering(positions);
    } else {
      Object.assign(this.state.existingPosition, position);
    }

    this.setState(
      Object.assign(this.updatePositionsField(positions), {
        showAddEditModal: false,
      })
    );
  }

  // Remove values injected by ReactSortable component
  scrubSortableValues(
    positions: $ReadOnlyArray<NewPositionInfo>
  ): $ReadOnlyArray<NewPositionInfo> {
    return positions.map((position: NewPositionInfo) =>
      _.omit(position, ["chosen", "selected"])
    );
  }

  updatePositionsField(
    positions: $ReadOnlyArray<NewPositionInfo>,
    state: ?State
  ): State {
    const newState: State = _.clone(state || this.state);
    newState.positions = this.scrubSortableValues(positions);
    newState.positionsJson = JSON.stringify(newState.positions);
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: this.props.elementid,
      fieldValue: newState.positions,
    });
    return newState;
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

  confirmDelete(confirmed: boolean): void {
    return promiseHelper.promisify(() => {
      let state: State = {
        showDeleteModal: false,
        positionToActUpon: null,
        positions: this.state.positions,
      };
      if (confirmed) {
        state.positions = this.state.positions.slice();
        _.remove(state.positions, (p: NewPositionInfo) =>
          this.state.positionToActUpon.tempId
            ? p.tempId === this.state.positionToActUpon.tempId
            : p.id === this.state.positionToActUpon.id
        );
      }
      state = Object.assign(
        state,
        this.updatePositionsField(state.positions, state)
      );
      this.setState(state);
    });
  }

  confirmHide(confirmed: boolean): void {
    return promiseHelper.promisify(() => {
      const position: NewPositionInfo = this.state.positionToActUpon;
      let state: State = {
        showHideModal: false,
        positionToActUpon: null,
        positions: this.state.positions,
      };
      if (confirmed) {
        position.isHidden = true;
      }
      state = Object.assign(
        state,
        this.updatePositionsField(state.positions, state)
      );
      this.setState(state);
    });
  }

  onChoose(evt: OnChooseEvent): void {
    this.setState({ selectedPosition: this.state.positions[evt.oldIndex] });
  }

  onUnchoose(evt: OnChooseEvent): void {
    this.setState({ selectedPosition: null });
  }

  render(): React$Node {
    const hiddenFormFields: Dictionary<string> = _.fromPairs([
      [this.props.elementid, this.state.positionsJson],
    ]);
    return (
      <div>
        <HiddenFormFields sourceDict={hiddenFormFields} />
        <label>Roles Needed &nbsp;</label>
        <Button
          variant="primary"
          size="sm"
          onClick={this.createNewPosition.bind(this)}
        >
          <i className={GlyphStyles.Add} aria-hidden="true"></i>
        </Button>

        {!_.isEmpty(this.state.positions) && (
          <div className="orderInstructions">
            <p>Volunteer roles will be listed in the order shown below.</p>
            <p className="dragRoleInstructions">Drag each role to rearrange.</p>
          </div>
        )}

        {!_.isEmpty(this.state.positions) && this._renderPositions()}

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

export default Container.create(PositionList, { withProps: true });
