// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {Tag} from '../../stores/TagStore.js';

import {List} from 'immutable'
import {Container} from 'flux/utils';
import TagDispatcher from '../../stores/ProjectSearchDispatcher.js';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import React from 'react';

type State = {|
  tags: List<Tag>,
|};

class ProjectTagContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      tags: ProjectSearchStore.getTags(),
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
