// @flow

import {ProjectData} from "../utils/ProjectAPIUtils.js";
import CurrentUser from '../utils/CurrentUser.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import MyProjectCard from '../componentsBySection/MyProjects/MyProjectCard.jsx';
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx';
import {ProjectAPIData} from "../utils/ProjectAPIUtils.js";
import metrics from "../utils/metrics.js";
import React from 'react';
import _ from 'lodash';

type MyProjectsAPIResponse = {|
  owned_projects: $ReadOnlyArray<ProjectAPIData>,
  volunteering_projects: $ReadOnlyArray<ProjectAPIData>
|};

type State = {|
  ownedProjects: ?Array<ProjectData>,
  volunteeringProjects: ?Array<ProjectData>,
  showConfirmDeleteModal: boolean
|};

class MyProjectsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      ownedProjects: null,
      volunteeringProjects: null,
      showConfirmDeleteModal: false
    };
  }

  componentWillMount(): void {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      'load',
      () => {
        const myProjectsApiResponse: MyProjectsAPIResponse = JSON.parse(xhr.response);
        this.setState({
          ownedProjects: myProjectsApiResponse.owned_projects.map(ProjectAPIUtils.projectFromAPIData),
          volunteeringProjects: myProjectsApiResponse.volunteering_projects.map(ProjectAPIUtils.projectFromAPIData)
        });
      }
    );
    xhr.open('GET', '/api/my_projects');
    xhr.send();
  }

  clickDeleteProject(project: ProjectData): void {
    this.setState({
      showConfirmDeleteModal: true,
      projectToDelete: project,
    });
  }

  removeProjectFromList(): void {
    metrics.logProjectDeleted(CurrentUser.userID(), this.state.projectToDelete.id);
    this.setState({
      ownedProjects: _.pull(this.state.ownedProjects, this.state.projectToDelete)
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
        //TODO: handle errors
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
          {!_.isEmpty(this.state.ownedProjects) && this.renderProjectCollection("Owned Projects", this.state.ownedProjects)}
          {!_.isEmpty(this.state.volunteeringProjects) && this.renderProjectCollection("Volunteering With", this.state.volunteeringProjects)}
        </div>
      )
      : <p><a href="/login">Login</a> to see a list of your projects.</p>;
  }
  
  renderProjectCollection(title:string, projects: $ReadOnlyArray<ProjectData>): React$Node{
    return (
      <div>
        <h3>{title}</h3>
        {projects.map(project => {
          return <MyProjectCard
            key={project.name}
            project={project}
            onProjectClickDelete={this.clickDeleteProject.bind(this)}
          />;
        })}
      </div>
    );
  }
}

export default MyProjectsController;
