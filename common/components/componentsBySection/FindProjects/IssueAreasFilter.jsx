// @flow

import ContextualDropdown from '../../common/ContextualDropdown.jsx';
import IssueAreaDropDownItem from './IssueAreaDropDownItem.jsx';
import IssueAreaList from './IssueAreaList.jsx';
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
            ? (
              <ContextualDropdown xPos={this.state.chevronX}>
                <IssueAreaList />
              </ContextualDropdown>
            )
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
