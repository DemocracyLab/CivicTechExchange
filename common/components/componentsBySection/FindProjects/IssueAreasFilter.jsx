import IssueArea from '../../enums/IssueArea.js';
import React from 'react';

class IssueAreasFilter extends React.PureComponent {
  render() {
    return (
      <span>
        Issue Areas  {this._renderChevron()}
        {this._renderIssueAreas()}
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

  _renderIssueAreas() {
    return Object.keys(IssueArea)
      .map(issueAreaKey =>
        <div>
          {issueAreaKey}: {IssueArea[issueAreaKey]}
        </div>
      );
  }
}

export default IssueAreasFilter;
