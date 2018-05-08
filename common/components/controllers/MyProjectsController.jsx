// @flow

import type {Project} from '../stores/ProjectSearchStore.js';
import CurrentUser from '../utils/CurrentUser.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import MyProjectCard from '../componentsBySection/MyProjects/MyProjectCard.jsx';
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx';
import React from 'react';
import _ from 'lodash';
import DjangoCSRFToken from 'django-react-csrftoken';


type State = {|
  projects: $ReadOnlyArray<Project>,
|};

class MyProjectsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      projects: [],
      showConfirmDeleteModal: false,
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

  clickDeleteProject(project: Project): void {
    this.setState({
      showConfirmDeleteModal: true,
      projectToDelete: project,
    })

  }

  removeProjectFromList(): void {
    this.setState({
      projects: _.pull(this.state.projects, this.state.projectToDelete)
    });
    this.forceUpdate();
  }

  confirmDeleteProject(confirmedDelete: boolean): void {
    if (confirmedDelete) {
      const url = "/projects/delete/" + this.state.projectToDelete.id + "/";
      //TODO: this should be ProjectAPIUtils.delete, not post
      ProjectAPIUtils.post(
        url,
        {},
        // success callback
        this.removeProjectFromList.bind(this)
      );
    };
    this.setState({
      showConfirmDeleteModal:false
    });
  }

  render(): React$Node {
    return CurrentUser.isLoggedIn()
      ? (
        <div className="MyProjectsController-root">
          
          <ConfirmationModal showModal={this.state.showConfirmDeleteModal}
          message="Are you sure you want to delete this project?"
          onSelection={this.confirmDeleteProject.bind(this)}
          />

          {this.state.projects.map(project => {
            return <MyProjectCard
              key={project.name}
              project={project}
              onProjectClickDelete={this.clickDeleteProject.bind(this)}
            />;
          })}
        </div>
      )
      : <p><a href="/login">Login</a> to see a list of your projects.</p>;
  }

}


export default MyProjectsController;
