// @flow

import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDownItem from './IssueAreaDropDownItem.jsx';
import React from 'react';

type Props = {|
  xPos: number,
|};
type State = {|
  contextualArrowX: number,
|};

class IssueAreaDropDown extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
      contextualArrowX: 0,
    };
  }

  render(): React$Node {
    return (
      <div
        className="IssueAreaDropDown-root"
        ref={this._onDropDownMount.bind(this)}
        style={{left: this.props.xPos}}>
        {this._renderContextualArrow()}
        {this._renderIssueAreas()}
      </div>
    );
  }

  _onDropDownMount(dropDownElement: ?React$ElementRef<*>): void {
    const contextualArrowX = dropDownElement
      ? dropDownElement.getBoundingClientRect().width / 2
      : 0;
    this.setState({contextualArrowX});
  }

  _renderIssueAreas(): React$Node {
    return Object.keys(IssueArea)
      .map(issueArea =>
        <IssueAreaDropDownItem issueArea={issueArea} key={issueArea}/>
      );
  }

  _renderContextualArrow(): React$Node {
    return (
      <div
        className="IssueAreaDropDown-contextualArrow"
        style={{left: this.state.contextualArrowX}}
      />
    );
  }
}

export default IssueAreaDropDown;
