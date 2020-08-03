// @flow
import type {FluxReduceStore} from 'flux/utils';
import {List} from 'immutable'
import {Container} from 'flux/utils';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import type {LocationRadius} from "../../stores/ProjectSearchStore.js";
import React from 'react';
import _ from 'lodash';

type State = {|
  keyword: string,
|};

class ResetSearchButton extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: ProjectSearchStore.getKeyword() || '',
    };
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary btn-block reset-search-button"
          disabled={!this.state.keyword}
          onClick={this._clearFilters.bind(this)}>
          Clear Filters
        </button>
      </React.Fragment>
    );
  }
  _clearFilters(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'CLEAR_FILTERS',
    });
  }
}

export default Container.create(ResetSearchButton);
