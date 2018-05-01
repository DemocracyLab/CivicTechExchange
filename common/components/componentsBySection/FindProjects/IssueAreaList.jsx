// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {Tag} from '../../stores/TagStore.js';

import {List} from 'immutable'
import IssueAreaDropDownItem from './IssueAreaDropDownItem.jsx';
import {Container} from 'flux/utils';
import TagStore from '../../stores/TagStore.js';
import React from 'react';
import _ from 'lodash';

type State = {|
  issueAreas: List<Tag>,
|};

class IssueAreaList extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [TagStore];
  }

  static calculateState(prevState: State): State {
    return {
      issueAreas: _.sortBy(TagStore.getIssueAreas().toArray(), ["displayName"])
    }
  }

  render(): React$Node {
    return (
      <div>
        {
          this.state.issueAreas.map(issueArea =>
            <IssueAreaDropDownItem
              issueArea={issueArea}
              key={issueArea.tagName}/>
          )
        }
      </div>
    );
  }
}

export default Container.create(IssueAreaList);
