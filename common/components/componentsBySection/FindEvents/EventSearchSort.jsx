// @flow
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import React from "react";
import Select from "react-select";
import EventSearchBar from "./EventSearchBar.jsx";
import { SelectOption } from "../../types/SelectOption.jsx";
import metrics from "../../utils/metrics.js";
import EventSearchStore from "../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../stores/EventSearchDispatcher.js";

type State = {|
  sortField: string,
|};

// change this to Upcoming / Past only, based on event timestamp
const sortOptions: $ReadOnlyArray<SelectOption> = [
  { value: "", label: "Date Modified" },
  { value: "event_name", label: "Name - Ascending" },
  { value: "-event_name", label: "Name - Descending" },
];

class EventSearchSort extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    const sortField = EventSearchStore.getSortField();

    const state = {
      sortField: sortField
        ? sortOptions.find(option => option.value === sortField)
        : sortOptions[0],
    };

    return state;
  }

  render(): React$Node {
    return (
      <div className="ProjectSearchSort-container">
        <EventSearchBar />
        {this._renderSortFieldDropdown()}
      </div>
    );
  }

  _handleSubmitSortField(sortOption: SelectOption): void {
    this.setState({ sortField: sortOption.value }, function() {
      this._onSubmitSortField();
    });
  }

  _onSubmitSortField(): void {
    EventSearchDispatcher.dispatch({
      type: "SET_SORT",
      sortField: this.state.sortField,
    });
    metrics.logEventSearchChangeSortEvent(this.state.sortField);
  }

  _renderSortFieldDropdown(): React$Node {
    // TODO: Replace with Selector component
    return (
      <Select
        options={sortOptions}
        value={this.state && this.state.sortField}
        onChange={this._handleSubmitSortField.bind(this)}
        classNamePrefix="ProjectSearchSort"
        className="form-control ProjectSearchSort-sortform"
        simpleValue={true}
        isClearable={false}
        isMulti={false}
      />
    );
  }
}

export default Container.create(EventSearchSort);
