// @flow
//usage: <ResetSearchButton tags="">  until I make the component update every time flux store does
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';

class ResetSearchButton extends React.Component<{||}, State> {
  constructor(props) {
    super(props);
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
      type: 'CLEAR_FILTERS',
    });
}

export default ResetSearchButton;
