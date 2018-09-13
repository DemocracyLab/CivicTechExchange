// @flow
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import React from 'react';
import TagSelectorCollapsible from "../../common/tags/TagSelectorCollapsible.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import {Locations} from "../../constants/ProjectConstants";

type State = {|
  sortField: string,
  location: string
|};

class ProjectFilterContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      sortField: ProjectSearchStore.getSortField(),
      location: ProjectSearchStore.getLocation()
    };
  }

  componentDidMount() {
    var urlParams = new URLSearchParams(window.location.search);
    
    this.setState({sortField: urlParams.get('sortField')}, function () {});
    this.setState({location: urlParams.get('location')}, function () {});
  }

  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root">
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

  _handleSubmitSortField(e: SyntheticEvent<HTMLSelectElement>): void {
    this.setState({sortField: e.target.value}, function () {
      this._onSubmitSortField();
    });
  }

  _handleSubmitLocation(e: SyntheticEvent<HTMLSelectElement>): void {
    this.setState({location: e.target.value}, function () {
      this._onSubmitLocation();
    });
  }

  _onSubmitSortField(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_SORT',
      sortField: this.state.sortField,
    });
    window.FB.AppEvents.logEvent(
      'sort_by_field',
      null,
      {sortField: this.state.sortField},
    );
  }

  _onSubmitLocation(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_LOCATION',
      location: this.state.location,
    });
    window.FB.AppEvents.logEvent(
      'filter_by_location',
      null,
      {location: this.state.location},
    );
  }

  _renderSortFieldDropdown(): React$Node{
    return  <select onChange={this._handleSubmitSortField.bind(this)}>
              <option disabled selected={this.state.sortField === '' || this.state.sortField === null} value>---</option>
              <option selected={this.state.sortField === 'project_date_modified'} value="project_date_modified">Date Modified - Ascending</option>
              <option selected={this.state.sortField === '-project_date_modified'} value="-project_date_modified">Date Modified - Descending</option>
              <option selected={this.state.sortField === 'project_name'} value="project_name">Name - Ascending</option>
              <option selected={this.state.sortField === '-project_name'} value="-project_name">Name - Descending</option>
            </select>;
  }

  _renderLocationDropdown(): React$Node{
    return  <select onChange={this._handleSubmitLocation.bind(this)}>
              <option disabled selected={this.state.location === '' || this.state.location === null}  value>---</option>
              {Locations.PRESET_LOCATIONS.map(location => <option key={location} selected={this.state.location === location} value={location}>{location}</option>)}
            </select>;
  }
}

export default Container.create(ProjectFilterContainer);
