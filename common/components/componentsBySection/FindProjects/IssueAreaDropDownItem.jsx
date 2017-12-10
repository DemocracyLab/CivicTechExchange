// @flow

import type {Tag} from '../../stores/TagStore.js';

import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';
import TagStore from '../../stores/TagStore.js';

type Props = {|
  +issueArea: Tag,
|};

class IssueAreaDropDownItem extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div
        className="IssueAreaDropDownItem-root"
        onClick={() => {
          ProjectSearchDispatcher.dispatch({
            type: 'ADD_TAG',
            tag: this.props.issueArea,
          });
          window.FB.AppEvents.logEvent(
            'addIssueAreaTag',
            null,
            {issueArea: this.props.issueArea.displayName},
          );
        }}>
        {this.props.issueArea.displayName}
      </div>
    );
  }

}

export default IssueAreaDropDownItem;
