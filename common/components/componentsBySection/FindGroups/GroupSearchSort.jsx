
// @flow
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import React from 'react';
import Select from 'react-select';
import GroupSearchBar from "./GroupSearchBar.jsx";
import {SelectOption} from "../../types/SelectOption.jsx";
import metrics from "../../utils/metrics.js";
import GroupSearchStore from "../../stores/GroupSearchStore.js";
import GroupSearchDispatcher from "../../stores/GroupSearchDispatcher.js";


type State = {|
  sortField: string
|};

const sortOptions: $ReadOnlyArray<SelectOption>  = [
    {value: "", label: "Date Modified"},
    {value: "group_name", label: "Name - Ascending"},
    {value: "-group_name", label: "Name - Descending"}
  ];

class GroupSearchSort extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [GroupSearchStore];
  }

  static calculateState(prevState: State): State {
    const sortField = GroupSearchStore.getSortField();

    const state = {
      sortField: sortField ? sortOptions.find(option => option.value === sortField) : sortOptions[0]
    };

    return state;
  }

  render(): React$Node {
    return (
      <div className="ProjectSearchSort-container">
          <GroupSearchBar />
          {this._renderSortFieldDropdown()}
      </div>
    );
  }

  _handleSubmitSortField(sortOption: SelectOption): void {
    this.setState({sortField: sortOption.value}, function () {
      this._onSubmitSortField();
    });
  }

  _onSubmitSortField(): void {
    GroupSearchDispatcher.dispatch({
      type: 'SET_SORT',
      sortField: this.state.sortField,
    });
    metrics.logGroupSearchChangeSortEvent(this.state.sortField);
  }

  _renderSortFieldDropdown(): React$Node{
    // TODO: Replace with Selector component
    return <Select
      options={sortOptions}
      value={this.state && this.state.sortField}
      onChange={this._handleSubmitSortField.bind(this)}
      classNamePrefix="ProjectSearchSort"
      className="form-control ProjectSearchSort-sortform"
      simpleValue={true}
      isClearable={false}
      isMulti={false}
    />
  }
}

export default Container.create(GroupSearchSort);
