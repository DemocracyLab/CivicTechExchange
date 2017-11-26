// @flow

import type {IssueAreaType} from '../../enums/IssueArea.js';

import IssueArea from '../../enums/IssueArea.js';
import React from 'react';

type Props = {|
  +issueArea: IssueAreaType,
|};

class IssueAreaDropDownItem extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div className="IssueAreaDropDownItem-root">
        {IssueArea[this.props.issueArea]}
      </div>
    );
  }
}

export default IssueAreaDropDownItem;
