// @flow

import React from "react";
import CurrentUser, { UserContext, MyGroupData } from "../utils/CurrentUser.js";
import ProjectAPIUtils,{ProjectDetailsAPIData} from "../utils/ProjectAPIUtils.js";
import url from "../utils/url.js";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import _ from "lodash";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import GroupProjectsCard from "../componentsBySection/GroupProjects/GroupProjectsCard.jsx";
import GroupAPIUtils from "../utils/GroupAPIUtils.js";
import ConfirmRemoveGroupProjectModal from "../componentsBySection/GroupProjects/ConfirmRemoveGroupProjectModal.jsx";


type State = {|
  projects: ?Array<ProjectDetailsAPIData>,
  groupId: number,
  showConfirmRemoveModal: boolean,
  projectToRemove: ?ProjectDetailsAPIData,
|};

class GroupProjectsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    // const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      projects: null,
      groupId:url.argument("group_id"),
      showConfirmRemoveModal: false,
      projectToRemove:null,
    };
    this.confirmRemoveProject = this.confirmRemoveProject.bind(this)
    this.clickRemoveProject = this.clickRemoveProject.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }
  //fetch api data
  componentDidMount(){
    if(CurrentUser.isLoggedIn()){
      // &&(CurrentUser.userID() === this.props.group.group_creator ||
      // CurrentUser.isCoOwner(this.props.group) ||
      // CurrentUser.isStaff())){
      //check if user is the member of the group
      ProjectAPIUtils.fetchProjectDetailsByGroupId(this.state.groupId,(data)=>{this.setState({projects:data.projects})})
    }
  }

  clickRemoveProject(project: ProjectDetailsAPIData): void {
    this.setState({
      showConfirmRemoveModal: true,
      projectToRemove: project,
    });
  }

  hideModal(){
    this.setState({showConfirmRemoveModal:false,projectToRemove:null});
  }

  successRemoved(){
    this.hideModal();
    //alert sucess
  }

  async confirmRemoveProject(message: string): void {
    const url =
      `/api/groups/${this.state.groupId}/remove/${this.state.projectToRemove.project_id}/`;
    ProjectAPIUtils.post(
      url,
      {message},
      ()=>{        
      this.setState({
        showConfirmRemoveModal: false,
      });
        //alert removing project successful
      },
      (err)=>{
        //alert removing project fail
      }
      // success callback
      //TODO: handle errors
    );
  }

  render(): React$Node {
    if (!CurrentUser.isLoggedIn) {
      return <LogInController prevPage={Section.GroupProjects} />;
    }
    return (
      <React.Fragment>
        <div className="container GroupProjectController-root">
          <ConfirmRemoveGroupProjectModal
            headerText="Remove Project from Group"
            showModal={this.state.showConfirmRemoveModal}
            onModalHide={this.hideModal}
            onCancel={this.hideModal}
            onConfirm={this.confirmRemoveProject}
            onSuccess={()=>{}}
          />

          {!_.isEmpty(this.state.projects) &&
            this.renderProjectCollection("Participating Project", this.state.projects)}
        </div>
      </React.Fragment>
    );
  }

  renderProjectCollection(
    title: string,
    projects: $ReadOnlyArray<ProjectDetailsAPIData>
  ): React$Node {
    return (
      <div>
        <h3>{title}</h3>
        {projects.map(project => {
          return (
            <GroupProjectsCard
              key={project.project_name}
              project={project}
              onGroupProjectClickRemove={this.clickRemoveProject}
            />
          );
        })}
      </div>
    );
  }
}

export default GroupProjectsController;
