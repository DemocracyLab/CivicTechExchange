// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {Tag} from '../../stores/TagStore.js';

import {List} from 'immutable'
import {Container} from 'flux/utils';
import TagDispatcher from '../../stores/ProjectSearchDispatcher.js';
import TagStore from '../../stores/TagStore.js';
import React from 'react';

type State = {|
  tags: List<Tag>,
|};

class ProjectTagContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [TagStore];
  }

  static calculateState(prevState: State): State {
    return {
      tags: TagStore.getTags(),
    };
  }

  render(): React$Node {
    return (
      <div>
        {
          this.state.tags.map(
            tag => <span key={tag.tagName}>{tag.tagName}, </span>,
          )
        }
      </div>
    );
  }
}

export default Container.create(ProjectTagContainer);
