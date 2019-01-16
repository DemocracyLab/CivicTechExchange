// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import React from 'react';
// import { url } from 'inspector';
import url from '../../utils/url.js';
import Section from '../../enums/Section.js';

type State = {|
  projects: List<Project>,
  project_pages: number,
  current_page: number
|};

class ProjectCardsContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      projects: ProjectSearchStore.getProjects(),
      project_pages: ProjectSearchStore.getProjectPages(),
      // current_page: prevState.current_page ? prevState.current_page++ : 1,
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12 col-md-9 col-xxl-10 p-0 m-0">
        <div className="container-fluid pl-0 pr-0">
          <div className="row">
            {this._renderCards()}
          </div>
          <div>
            <p>{ `Project Pages: ${this.state.project_pages}` }</p>
            <a href={url.section(Section.FindProjects, { page: this.state.current_page ? this.state.current_page++ : 2 })}>Next Page</a>
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
