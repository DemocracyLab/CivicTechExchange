// @flow

import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDown from './IssueAreaDropDown.jsx';
import React from 'react';

type State = {|
  chevronX: number,
  showDropdown: boolean,
|};

class IssueAreasFilter extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      chevronX: 0,
      showDropdown: false,
    };
  }

  render(): React$Node {
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

  _renderChevron(): React$Node {
    const chevron = '\u25BE';
    return (
      <span
        ref={this._onChevronMount.bind(this)}>
        {chevron}
      </span>
    );
  }

  _onChevronMount(chevronElement: ?React$ElementRef<*>): void {
    const dropDownWidth = 185;
    const chevronX = chevronElement
      ? chevronElement.getBoundingClientRect().left - (dropDownWidth / 2)
      : 0;
    this.setState({chevronX});
  }
}

export default IssueAreasFilter;
