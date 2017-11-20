import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDownItem from './IssueAreaDropDownItem.jsx';
import React from 'react';

class IssueAreaDropDown extends React.PureComponent {
  render() {
    return (
      <div className="IssueAreaDropDown-root">
        {this._renderIssueAreas()}
      </div>
    );
  }

  _renderIssueAreas() {
    return Object.keys(IssueArea)
      .map(issueArea =>
        <IssueAreaDropDownItem issueArea={issueArea} key={issueArea}/>
      );
  }
}

export default IssueAreaDropDown;
