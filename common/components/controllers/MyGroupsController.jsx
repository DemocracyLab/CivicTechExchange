// @flow

import CurrentUser from '../utils/CurrentUser.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import MyGroupsCard from '../componentsBySection/MyGroups/MyGroupsCard.jsx';
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx';
import MyGroupsStore,{MyGroupData, MyGroupsAPIResponse} from "../stores/MyGroupsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import metrics from "../utils/metrics.js";
import {Container} from 'flux/utils';
import ProjectVolunteerRenewModal from "../common/projects/ProjectVolunteerRenewModal.jsx";
import ProjectVolunteerConcludeModal from "../common/projects/ProjectVolunteerConcludeModal.jsx";
import LogInController from "./LogInController.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section";
import React from 'react';
import _ from 'lodash';
import Headers from "../common/Headers.jsx";


type State = {|
  ownedGroups: ?Array<MyGroupData>,
//   volunteeringProjects: ?Array<MyProjectData>,
//   showConfirmDeleteModal: boolean,
//   showRenewVolunteerModal: boolean,
//   showConcludeVolunteerModal: boolean
|};

class MyGroupsController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      ownedGroups: null,
      // volunteeringProjects: null,
      // showConfirmDeleteModal: false,
      // showRenewVolunteerModal: false,
      // showConcludeVolunteerModal: false
    };
  }
  
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [MyGroupsStore];
  }
  
  static calculateState(prevState: State): State {
    const myGroups: MyGroupsAPIResponse = MyGroupsStore.getMyGroups();
    return {
      ownedGroups: myGroups && myGroups.owned_groups,
      // volunteeringProjects: myGroups && myGroups.volunteering_projects
    };
  }
  
  componentWillMount(): void {
    // setTimeout(function() { // Run after dispatcher has finished
    //   UniversalDispatcher.dispatch({type: 'INIT'});
    // }, 0);
    // const args = url.arguments(window.location.href);
    // if ("from" in args && args.from === "renewal_notification_email" && CurrentUser.isLoggedIn()) {
    //   metrics.logVolunteerClickReviewCommitmentsInEmail(CurrentUser.userID());
    // }
  }
  
  clickDeleteGroup(group: MyGroupData): void {
    this.setState({
      showConfirmDeleteModal: true,
      groupToDelete: group,
    });
  }
  
  clickRenewVolunteerWithProject(project: MyProjectData): void {
    this.setState({
      showRenewVolunteerModal: true,
      applicationId: project.application_id
    });
  }
  
  clickConcludeVolunteerWithProject(project: MyProjectData): void {
    this.setState({
      showConcludeVolunteerModal: true,
      applicationId: project.application_id
    });
  }

  removeGroupFromList(): void {
    metrics.logProjectDeleted(CurrentUser.userID(), this.state.groupToDelete.group_id);
    this.setState({
      ownedGroup: _.pull(this.state.ownedGroups, this.state.groupToDelete)
    });
    this.forceUpdate();
  }

  confirmDeleteProject(confirmedDelete: boolean): void {
    if (confirmedDelete) {
      const url = "/groups/delete/" + this.state.groupToDelete.group_id + "/";
      //TODO: this should be ProjectAPIUtils.delete, not post
      ProjectAPIUtils.post(
        url,
        {},
        // success callback
        this.removeGroupFromList.bind(this)
        //TODO: handle errors
      );
    }
    this.setState({
      showConfirmDeleteModal:false
    });
  }

  render(): React$Node {
    if (!CurrentUser.isLoggedIn) {
      return <LogInController prevPage={Section.MyGroup}/>;
    }

    return (
      <React.Fragment>
        <Headers
          title="My Groups | DemocracyLab"
          description="My Groups page"
        />
        <div className="MyProjectsController-root">
          <ConfirmationModal
            showModal={this.state.showConfirmDeleteModal}
            message="Are you sure you want to delete this group?"
            onSelection={this.confirmDeleteProject.bind(this)}
          />

          {!_.isEmpty(this.state.ownedGroups) && this.renderGroupCollection("Owned Groups", this.state.ownedGroups)}
          {/* {!_.isEmpty(this.state.volunteeringProjects) && this.renderProjectCollection("Volunteering With", this.state.volunteeringProjects)} */}
        </div>
      </React.Fragment>
    );
  }
  
  renderGroupCollection(title:string, groups: $ReadOnlyArray<MyGroupData>): React$Node{
    return (
      <div>
        <h3>{title}</h3>
        {groups.map(group => {
          return <MyGroupsCard
            key={group.group_name}
            group={group}
            onGroupClickDelete={this.clickDeleteGroup.bind(this)}
          />;
        })}
      </div>
    );
  }
}

export default Container.create(MyGroupsController);
