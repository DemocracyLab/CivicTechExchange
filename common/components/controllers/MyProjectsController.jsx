// @flow

import {ProjectData} from "../utils/ProjectAPIUtils.js";
import CurrentUser from '../utils/CurrentUser.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import MyProjectCard from '../componentsBySection/MyProjects/MyProjectCard.jsx';
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx';
import MyProjectsStore,{MyProjectData, MyProjectsAPIResponse} from "../stores/MyProjectsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import metrics from "../utils/metrics.js";
import {Container} from 'flux/utils';
import React from 'react';
import _ from 'lodash';


type State = {|
  ownedProjects: ?Array<MyProjectData>,
  volunteeringProjects: ?Array<MyProjectData>,
  showConfirmDeleteModal: boolean
|};

class MyProjectsController extends React.Component<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      ownedProjects: null,
      volunteeringProjects: null,
      showConfirmDeleteModal: false
    };
  }
  
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [MyProjectsStore];
  }
  
  static calculateState(prevState: State): State {
    const myProjects: MyProjectsAPIResponse = MyProjectsStore.getMyProjects();
    return {
      ownedProjects: myProjects && myProjects.owned_projects,
      volunteeringProjects: myProjects && myProjects.volunteering_projects
    };
  }
  
  componentWillMount(): void {
    UniversalDispatcher.dispatch({type: 'INIT'});
  }
  
  clickDeleteProject(project: MyProjectData): void {
    this.setState({
      showConfirmDeleteModal: true,
      projectToDelete: project,
    });
  }

  removeProjectFromList(): void {
    metrics.logProjectDeleted(CurrentUser.userID(), this.state.projectToDelete.project_id);
    this.setState({
      ownedProjects: _.pull(this.state.ownedProjects, this.state.projectToDelete)
    });
    this.forceUpdate();
  }

  confirmDeleteProject(confirmedDelete: boolean): void {
    if (confirmedDelete) {
      const url = "/projects/delete/" + this.state.projectToDelete.project_id + "/";
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
      // TODO: Redirect to My Projects page after logging in
  }
  
  renderProjectCollection(title:string, projects: $ReadOnlyArray<MyProjectData>): React$Node{
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

export default Container.create(MyProjectsController);
