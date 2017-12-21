// @flow

import type {Project} from '../stores/ProjectSearchStore.js';

import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import ProjectCard from '../componentsBySection/FindProjects/ProjectCard.jsx';
import React from 'react';

type State = {|
  projects: $ReadOnlyArray<Project>,
|};

class MyProjectsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      projects: [],
    };
  }

  componentWillMount(): void {
    fetch(new Request('/api/my_projects'))
      .then(response => response.json())
      .then(projects =>
        this.setState({
          projects: projects.map(ProjectAPIUtils.projectFromAPIData),
        }),
      );
  }

  render(): React$Node {
    return (
      <div>
        <div>
          My Projects | Applications
        </div>
        <div>
          PROJECTS YOU OWN
        </div>
          [project card]
        <div>
        </div>
          PROJECTS YOU ARE VOLUNTEERING ON
        <div>
          {this.state.projects.map(project => {
            return <ProjectCard key={project.name} project={project} />;
          })}
        </div>
          [project card]
        <div>
          [project card]
        </div>
        <div>
          [project card]
        </div>
      </div>
    );
  }
}

export default MyProjectsController;
