// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';
import ProjectSearchSort from './ProjectSearchSort.jsx';
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
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12 col-md-9 col-xxl-10 p-0 m-0">
        <div className="container-fluid">
            <ProjectSearchSort />
          <div className="row">
            {!_.isEmpty(this.state.projects) && <h2 className="ProjectCardContainer-header">Find and volunteer with the best tech-for-good projects</h2>}
            {this._renderCards()}
          </div>
        </div>
      </div>
    );
  }

  _renderCards(): React$Node {
    return !this.state.projects
      ? 'Loading projects ...'
      : this.state.projects.size === 0
        ? 'No projects match the provided criteria.  Sign up for an alert to be notified when matching projects are added or try a different set of filters.'
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
