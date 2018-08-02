// @flow
import type {FluxReduceStore} from 'flux/utils';
import {List} from 'immutable'
import {Container} from 'flux/utils';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';

type State = {|
  keyword: string,
  tags: List<TagDefinition>,
|};

class ResetSearchButton extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: ProjectSearchStore.getKeyword() || '',
      tags: ProjectSearchStore.getTags() || [],
    };
  }

  render(): React$Node {
    return (
      <div  >
        <button
          className="ResetSearch"
          disabled={!(this.state.keyword || this.state.tags.size > 0) }
          onClick={this._clearFilters.bind(this)}>
          Reset Filters
        </button>
      </div>
    );
  }
  _clearFilters(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'CLEAR_FILTERS',
    });
  }
}

export default Container.create(ResetSearchButton);
