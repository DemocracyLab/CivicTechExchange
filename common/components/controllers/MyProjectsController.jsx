// @flow

import type {Project} from '../stores/ProjectSearchStore.js';

import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import MyProjectCard from '../componentsBySection/MyProjects/MyProjectCard.jsx';
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
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      'load',
      () =>
        this.setState({
          projects: JSON.parse(xhr.response)
            .map(ProjectAPIUtils.projectFromAPIData)}),
    );
    xhr.open('GET', '/api/my_projects');
    xhr.send();
  }

  render(): React$Node {
    return (
      <div className="MyProjectsController-root">
        {this.state.projects.map(project => {
          return <MyProjectCard key={project.name} project={project} />;
        })}
      </div>
    );
  }
}

export default MyProjectsController;
