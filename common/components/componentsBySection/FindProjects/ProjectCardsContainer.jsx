// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';

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
      <div>
        {this._useDummyData() ? this._renderDummyCards() : this._renderCards()}
      </div>
    );
  }

  _useDummyData(): boolean {
    return new URL(
      window.location.href
    ).searchParams
      .get('useDummyData') === '1';
  }

  _renderCards(): React$Node {
    return this.state.projects
      ? this.state.projects.map(
        (project, index) =>
          <ProjectCard
            description={project.description}
            key={index}
            issueArea={project.issueArea}
            location={project.location}
            name={project.name}
          />
      ) : 'Loading projects ...';
  }

  _renderDummyCards(): React$Node {
    return Array(20)
      .fill(this._getDummyProject())
      .map((project, index) =>
        <ProjectCard
          description={project.description}
          key={index}
          issueArea={project.issueArea}
          location={project.location}
          name={project.name}
        />
      );
  }

  _getDummyProject(): Project {
    return {
      description: '"The pharmaceutical and insurance industries are legally empowered to hold sick children hostage while their parents frantically bankrupt themselves trying to save their sons or daughters." -- Chris Hedges',
      issueArea: 'Social Justice',
      location: 'Seattle',
      name: 'Incite Socialist Revolution'
    }
  }
}

export default Container.create(ProjectCardsContainer);
