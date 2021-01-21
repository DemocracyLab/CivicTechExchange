// @flow
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import React from "react";
import Select from "react-select";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import ProjectSearchBar from "./ProjectSearchBar.jsx";
import { SelectOption } from "../../types/SelectOption.jsx";
import metrics from "../../utils/metrics.js";

type Props = {|
  hideSearch: ?boolean,
|};

type State = {|
  sortField: string,
|};

const sortOptions: $ReadOnlyArray<SelectOption> = [
  // {value: '", label: "---"},
  // {value: "project_date_modified", label: "Date Modified - Ascending"},
  { value: "", label: "Date Modified" },
  { value: "project_name", label: "Name - Ascending" },
  { value: "-project_name", label: "Name - Descending" },
];

class ProjectSearchSort extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    const sortField = ProjectSearchStore.getSortField();

    const state = {
      sortField: sortField
        ? sortOptions.find(option => option.value === sortField)
        : sortOptions[0],
    };

    return state;
  }

  render(): React$Node {
    return this.props.hideSearch ? (
      <React.Fragment>{this._renderSortFieldDropdown()}</React.Fragment>
    ) : (
      <div className="ProjectSearchSort-container">
        <ProjectSearchBar />
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
    ProjectSearchDispatcher.dispatch({
      type: "SET_SORT",
      sortField: this.state.sortField,
    });
    metrics.logSearchChangeSortEvent(this.state.sortField);
  }

  _renderSortFieldDropdown(): React$Node {
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

export default Container.create(ProjectSearchSort);
