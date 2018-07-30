// @flow
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils'; //TODO: find out if I need this?
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';

class ResetSearchButton extends React.Component<{||}, State> {
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
      type: 'CLEAR_FILTERS',
    });
  }
}

export default ResetSearchButton;
