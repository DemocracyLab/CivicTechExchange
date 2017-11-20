import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDown from './IssueAreaDropDown.jsx';
import React from 'react';

class IssueAreasFilter extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      chevronX: 0,
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
            ? <IssueAreaDropDown xPos={this.state.chevronX}/>
            : null
        }
      </span>
    );
  }

  _renderChevron() {
    const chevron = '\u25BE';
    return (
      <span
        ref={this._onChevronMount.bind(this)}>
        {chevron}
      </span>
    );
  }

  _onChevronMount(chevronElement) {
    const dropDownWidth = 185;
    const chevronX = chevronElement
      ? chevronElement.getBoundingClientRect().left - (dropDownWidth / 2)
      : 0;
    this.setState({chevronX});
  }
}

export default IssueAreasFilter;
