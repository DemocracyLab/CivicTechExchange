// @flow

import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';

type State = {|
  keyword: ?string,
|};

class ProjectSearchBar extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      keyword: '',
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectSearchBar-root">
        Enter a keyword:
        <input
          value={this.state.keyword}
          onChange={e => this.setState({keyword: e.target.value})}
          onKeyPress={this._handleKeyPress.bind(this)}
        />
        <button onClick={this._onSubmitKeyword.bind(this)}>Submit</button>
      </div>
    );
  }

  _handleKeyPress(e: SyntheticEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      this._onSubmitKeyword();
    }
  }

  _onSubmitKeyword(): void {
    if (this.state.keyword) {
      ProjectSearchDispatcher.dispatch({
        type: 'FILTER_BY_KEYWORD',
        keyword: this.state.keyword,
      });
    }
  }
}

export default ProjectSearchBar;
