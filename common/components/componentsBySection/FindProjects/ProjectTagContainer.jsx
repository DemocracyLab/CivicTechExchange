// @flow

import type {FluxReduceStore} from 'flux/utils';
// import type {Tag} from '../../stores/TagStore.js';
import ResetSearchButton from './ResetSearchButton.jsx';
import {List} from 'immutable'
import {Container} from 'flux/utils';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectTag from './ProjectTag.jsx';
import React from 'react';
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";

type State = {|
  tags: List<TagDefinition>
|};

class ProjectTagContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      tags: ProjectSearchStore.getTags() || []
    };
  }

  render(): React$Node {
    return (
      <div
        className={
          'ProjectTagContainer-root col-12'
            + (this.state.tags.size === 0 ? '  ProjectTagContainer-noTags' : '')
        }>
        {
          this.state.tags.map(
            tag => <ProjectTag key={tag.tag_name} tag={tag}/>,
          )
        }
        <ResetSearchButton />
      </div>
    );
  }
}

export default Container.create(ProjectTagContainer);
