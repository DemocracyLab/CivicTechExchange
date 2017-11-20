import IssueArea from '../../enums/IssueArea.js';
import React from 'react';

class IssueAreaDropDownItem extends React.PureComponent {
  render() {
    return (
      <div className="IssueAreaDropDownItem-root">
        {IssueArea[this.props.issueArea]}
      </div>
    );
  }
}

export default IssueAreaDropDownItem;
