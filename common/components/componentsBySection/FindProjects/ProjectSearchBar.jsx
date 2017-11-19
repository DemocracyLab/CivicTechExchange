import React from 'react';

class ProjectSearchBar extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      keyword: '',
    };
  }

  render() {
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

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this._onSubmitKeyword();
    }
  }

  _onSubmitKeyword() {
    this.props.onSubmitKeyword(this.state.keyword);
  }
}

export default ProjectSearchBar;
