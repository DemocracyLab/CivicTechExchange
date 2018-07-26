// @flow

import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import {List} from 'immutable'
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import React from 'react';

type State = {|
  tags: List<TagDefinition>,
|};

class ResetSearchButton extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      tags: ProjectSearchStore.getTags() || [],
    };
  }

  render(): React$Node {
    return (
      <div>
        <button
          className="ProjectSearchBar-clear"
          onClick={this._clearFilters.bind(this)}>
          Reset Filters
        </button>
      </div>
    );
  }

  _clearFilters(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_KEYWORD',
      keyword: '',
    })
    console.log(ProjectSearchStore);
  //   ProjectSearchDispatcher.dispatch({
  //     type: 'REMOVE_TAG',
  //     tag: this.props.tag,
  // })
    }
}

export default ResetSearchButton;
