// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';
import ProjectSearchSort from './ProjectSearchSort.jsx';
import ProjectTagContainer from './ProjectTagContainer.jsx';
import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import React from 'react';

type State = {|
  projects: List<Project>
|};

class ProjectCardsContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      projects: ProjectSearchStore.getProjects(),
      keyword: ProjectSearchStore.getKeyword() || '',
      tags: ProjectSearchStore.getTags() || [],
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12 col-md-9 col-xxl-10 p-0 m-0">
        <div className="container-fluid">
            <ProjectSearchSort />
            <ProjectTagContainer />
          <div className="row">
            {!_.isEmpty(this.state.projects) && <h2 className="ProjectCardContainer-header">{this._renderCardHeaderText()}</h2>}
            {this._renderCards()}
          </div>
        </div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.state.keyword || this.state.tags.size > 0) {
      return this.state.projects.size === 1 ? this.state.projects.size + ' tech-for-good project found' : this.state.projects.size + ' tech-for-good projects found'
    } else {
      return 'Find and volunteer with the best tech-for-good projects'
    }
  }

  _renderCards(): React$Node {
    return !this.state.projects
      ? 'Loading projects ...'
      : this.state.projects.size === 0
        ? 'No projects match the provided criteria. Try a different set of filters or search term.'
        : this.state.projects.map(
          (project, index) =>
            <ProjectCard
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
        );
  }
}

export default Container.create(ProjectCardsContainer);
