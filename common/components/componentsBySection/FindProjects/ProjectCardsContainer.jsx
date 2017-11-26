// @flow

import type {Project} from '../../controllers/FindProjectsController.jsx';

import ProjectCard from './ProjectCard.jsx';
import React from 'react';
import {List} from 'immutable'

type Props = {|
  +projects: List<Project>
|};

class ProjectCardsContainer extends React.PureComponent<Props> {
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
    return this.props.projects
      ? this.props.projects.map(
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

export default ProjectCardsContainer;
