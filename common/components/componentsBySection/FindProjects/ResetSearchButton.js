// @flow
//usage: <ResetSearchButton tags="">  until I make the component update every time flux store does
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import React from 'react';

type State = {|
  tags: List<TagDefinition>,
|};

class ResetSearchButton extends React.Component<{||}, State> {
  constructor(props) {
    super(props);
  }

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
          className="ResetSearch"
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
    });
    let tagsToRemove = this.props.tags.toArray();
    tagsToRemove.forEach(function(tag) {
      ProjectSearchDispatcher.dispatch({
        type: 'REMOVE_TAG',
        tag: tag,
        })
      });
    }
}

export default ResetSearchButton;
