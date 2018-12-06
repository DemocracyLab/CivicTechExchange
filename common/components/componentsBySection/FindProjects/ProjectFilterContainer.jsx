// @flow
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import React from 'react';
import Select from 'react-select'
import TagSelectorCollapsible from "../../common/tags/TagSelectorCollapsible.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import {Locations} from "../../constants/ProjectConstants";
import {SelectOption} from "../../types/SelectOption.jsx";
import metrics from "../../utils/metrics.js";


type State = {|
  sortField: string,
  location: string
|};

const sortOptions: $ReadOnlyArray<SelectOption>  = [
    // {value: "", label: "---"},
    // {value: "project_date_modified", label: "Date Modified - Ascending"},
    {value: "", label: "Date Modified"},
    {value: "project_name", label: "Name - Ascending"},
    {value: "-project_name", label: "Name - Descending"}
  ];

const locationOptions: $ReadOnlyArray<SelectOption>  = [{value:"", label:"---"}].concat(
  Locations.PRESET_LOCATIONS.map(location => ({value:location, label:location})));

class ProjectFilterContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    const sortField = ProjectSearchStore.getSortField();
    const location = ProjectSearchStore.getLocation();

    const state = {
      sortField: sortField ? sortOptions.find(option => option.value === sortField) : sortOptions[0],
      location: location ? locationOptions.find(option => option.value === location) : locationOptions[0],
    };

    return state;
  }

  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root col-12 col-md-3 col-xxl-2">
        <div className="ProjectFilterContainer-label">
          Sort By:
        </div>
        {this._renderSortFieldDropdown()}
        <div className="ProjectFilterContainer-label">
          Location:
        </div>
        {this._renderLocationDropdown()}
        <div className="ProjectFilterContainer-label">
          Filter By:
        </div>
        <TagSelectorCollapsible category={TagCategory.ISSUES} title="Issue Areas" />
        <TagSelectorCollapsible category={TagCategory.ROLE} title="Roles Needed" />
        <TagSelectorCollapsible category={TagCategory.PROJECT_STAGE} title="Project Stage" />
        <TagSelectorCollapsible category={TagCategory.TECHNOLOGIES_USED} title="Technologies Used" />
        <TagSelectorCollapsible category={TagCategory.ORGANIZATION} title="Communities" />
      </div>
    );
  }

  _handleSubmitSortField(sortOption: SelectOption): void {
    this.setState({sortField: sortOption.value}, function () {
      this._onSubmitSortField();
    });
  }

  _handleSubmitLocation(location: SelectOption): void {
    this.setState({location: location.value}, function () {
      this._onSubmitLocation();
    });
  }

  _onSubmitSortField(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_SORT',
      sortField: this.state.sortField,
    });
    metrics.logSearchChangeSortEvent(this.state.sortField);
  }

  _onSubmitLocation(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_LOCATION',
      location: this.state.location,
    });
    metrics.logSearchByLocationEvent(this.state.location);
  }

  _renderSortFieldDropdown(): React$Node{
    return <Select
      options={sortOptions}
      value={this.state && this.state.sortField}
      onChange={this._handleSubmitSortField.bind(this)}
      className="form-control"
      simpleValue={true}
      isClearable={false}
      isMulti={false}
    />
  }

  _renderLocationDropdown(): React$Node{
    return <Select
      options={locationOptions}
      value={this.state && this.state.location}
      onChange={this._handleSubmitLocation.bind(this)}
      className="form-control"
      simpleValue={true}
      isClearable={false}
      isMulti={false}
    />
  }
}

export default Container.create(ProjectFilterContainer);
