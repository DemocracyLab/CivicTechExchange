// @flow

import type {Project} from '../stores/ProjectSearchStore.js';

import CurrentUser from '../utils/CurrentUser.js'
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
    return CurrentUser.isLoggedIn()
      ? (
        <div className="MyProjectsController-root">
          {this.state.projects.map(project => {
            return <MyProjectCard key={project.name} project={project} />;
          })}
        </div>
      )
      : <p><a href="/login">Login</a> to see a list of your projects.</p>;
  }
}
  // the Delete button will need to:
  // - pass the id to MyProjectController

  
  // MyProjectController will need to:
  // - bring up the confirmation modal
  // - if 'yes', use url.js to create the delete route and delete
  // - then remove the project from this.state.projects, rerender list of project cards


export default MyProjectsController;
