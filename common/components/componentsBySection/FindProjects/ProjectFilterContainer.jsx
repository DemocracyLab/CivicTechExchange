// @flow

import React from 'react';
import TagSelectorCollapsible from "../../common/tags/TagSelectorCollapsible.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';

class ProjectFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root">
        <div className="ProjectFilterContainer-label">
          Sort By:
        </div>
        <select onChange={this._handleSubmitSort.bind(this)}>
          <option disabled selected value>---</option>
          <option value="project_date_modified">Date Modified - Ascending</option>
          <option value="-project_date_modified">Date Modified - Descending</option>
          <option value="project_name">Name - Ascending</option>
          <option value="-project_name">Name - Descending</option>
        </select>
        <div className="ProjectFilterContainer-label">
          Filter By:
        </div>
        <TagSelectorCollapsible category={TagCategory.ISSUES} title="Issue Areas" />
        <TagSelectorCollapsible category={TagCategory.TECHNOLOGIES_USED} title="Technology Used" />
        <TagSelectorCollapsible category={TagCategory.ROLE} title="Roles Needed" />
        <TagSelectorCollapsible category={TagCategory.ORGANIZATION} title="Communities" />
        <TagSelectorCollapsible category={TagCategory.PROJECT_STAGE} title="Project Stage" />
      </div>
    );
  }

  _handleSubmitSort(e: SyntheticEvent<HTMLSelectElement>): void {
    this.setState({sortField: e.target.value}, function () {
      this._onSubmitSortField();
    });
  }

  _onSubmitSortField(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_SORT',
      sortField: this.state.sortField,
    });
    window.FB.AppEvents.logEvent(
      'sortByField',
      null,
      {sortField: this.state.sortField},
    );
  }
}

export default ProjectFilterContainer;
