// @flow

import React from "react";
import CurrentUser, { UserContext, MyGroupData } from "../utils/CurrentUser.js";
import ProjectAPIUtils,{ProjectDetailsAPIData} from "../utils/ProjectAPIUtils.js";
import urlHelper from "../utils/url.js";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import metrics from "../utils/metrics.js";
import Section from "../enums/Section.js";
import _ from "lodash";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import GroupProjectsCard from "../componentsBySection/GroupProjects/GroupProjectsCard.jsx";
import GroupAPIUtils,{GroupDetailsAPIData} from "../utils/GroupAPIUtils.js";
import ConfirmRemoveGroupProjectModal from "../componentsBySection/GroupProjects/ConfirmRemoveGroupProjectModal.jsx";
import Toast from "../common/notification/Toast.jsx";


type State = {|
  projects: ?Array<ProjectDetailsAPIData>,
  groupId:string,
  groupDetail: ?GroupDetailsAPIData,
  showConfirmRemoveModal: boolean,
  showToast:boolean,
  projectToRemove: ?ProjectDetailsAPIData,
|};

class GroupProjectsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    // const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      projects: null,
      groupId:urlHelper.argument("id"),
      groupDetail:null,
      showConfirmRemoveModal: false,
      showToast:false,
      projectToRemove:null,
    };
    this.confirmRemoveProject = this.confirmRemoveProject.bind(this)
    this.clickRemoveProject = this.clickRemoveProject.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.moveBackToGroup = this.moveBackToGroup.bind(this)
    this.successRemoved = this.successRemoved.bind(this)
    this.isGroupOwner = this.isGroupOwner.bind(this)
  }
  //fetch api data
  componentDidMount(){
    if(CurrentUser.isLoggedIn()){
      const {groupId} = this.state;
      ProjectAPIUtils.fetchProjectsByGroupId(groupId,true,(data)=>{this.setState({projects:data.projects})})
      GroupAPIUtils.fetchGroupDetails(groupId,(data)=>this.setState({groupDetail:data}))
    }else{
      const currentUrl = window.location.href;
      window.location.href = urlHelper.logInThenReturn(currentUrl);
    }
  }

  successRemoved(){
    this.setState((prevState)=>{
      //take the removed project out of the project list 
      const projectsFiltered = prevState.projects.filter(({project_id})=>project_id!=prevState.projectToRemove.project_id)
      return {showToast:true,projects:projectsFiltered}
    });
    this.hideModal();
  }

  clickRemoveProject(project: ProjectDetailsAPIData): void {
    this.setState({
      showConfirmRemoveModal: true,
      projectToRemove: project,
    });
  }

  hideModal(){
    this.setState({showConfirmRemoveModal:false});
  }

  moveBackToGroup(){
    const url = urlHelper.section(Section.AboutGroup,{id:this.state.groupId});
    window.location.href = url;
  }

  isGroupOwner(){
    return CurrentUser.userID() === this.state.groupDetail.group_creator;
  }
  async confirmRemoveProject(message: string): void {
    const {groupId,projectToRemove} = this.state;
    await GroupAPIUtils.removeProjectFromGroup({groupId,projectId:projectToRemove.project_id,message},
      ()=>{this.successRemoved();},
      ()=>{}
    )
  }

  render(): React$Node {
    const {projects,showToast,groupDetail,projectToRemove} = this.state;
    if(!groupDetail || projects === null){
      return <p>Loading...</p>
    }
    //only group owner can access the page
    if(!this.isGroupOwner()){
      urlHelper.navigateToSection(Section.Home);
    }
    return (
      <React.Fragment>
        <div className="container GroupProjectController-root">
          <ConfirmRemoveGroupProjectModal
            showModal={this.state.showConfirmRemoveModal}
            onModalHide={this.hideModal}
            onCancel={this.hideModal}
            onConfirm={this.confirmRemoveProject}
          />
          <Toast animation timeoutMilliseconds={3000} header={`${projectToRemove?.project_name} was removed from ${groupDetail?.group_name}`} show={showToast} onClose={()=>this.setState({showToast:false})}/>
          {this.renderProjectCollection(`Participating Project of ${groupDetail?.group_name}`, projects)}
        </div>
      </React.Fragment>
    );
  }

  renderProjectCollection(
    title: string,
    projects: $ReadOnlyArray<ProjectDetailsAPIData>
  ): React$Node {
    const components = _.isEmpty(this.state.projects)? <p>There are no projects in this group</p> 
                    : projects.map(project => {
                      return (
                        <GroupProjectsCard
                          key={project.project_name}
                          project={project}
                          onGroupProjectClickRemove={this.clickRemoveProject}
                        />
                      );
    })
    return (
      <div>
        <div className="GroupProjectController-header">
          <h3>{title}</h3>
          <div className="GroupProjectController-return-group-button" onClick={this.moveBackToGroup}>Return to Group</div>
        </div>
        {components}
      </div>
    );
  }
}

export default GroupProjectsController;
