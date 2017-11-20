import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDown from './IssueAreaDropDown.jsx';
import React from 'react';

class IssueAreasFilter extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      showDropdown: false,
    };
  }

  render() {
    return (
      <span
        onClick={() => this.setState({showDropdown: !this.state.showDropdown})}>
        Issue Areas  {this._renderChevron()}
        {
          this.state.showDropdown
            ? <IssueAreaDropDown />
            : null
        }
      </span>
    );
  }

  _renderChevron() {
    const chevron = '\u25BE';
    return (
      <span id="issueAreasChevron">
        {chevron}
      </span>
    );
  }
}

export default IssueAreasFilter;
