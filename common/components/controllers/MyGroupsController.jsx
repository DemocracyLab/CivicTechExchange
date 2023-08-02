// @flow

import React from "react";
import CurrentUser, { UserContext, MyGroupData } from "../utils/CurrentUser.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import MyGroupsCard from "../componentsBySection/MyGroups/MyGroupsCard.jsx";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import _ from "lodash";

type State = {|
  ownedGroups: ?Array<MyGroupData>,
  showConfirmDeleteModal: boolean,
|};

class MyGroupsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      ownedGroups: userContext.owned_groups,
      showConfirmDeleteModal: false,
    };
  }

  clickDeleteGroup(group: MyGroupData): void {
    this.setState({
      showConfirmDeleteModal: true,
      groupToDelete: group,
    });
  }

  removeGroupFromList(): void {
    metrics.logProjectDeleted(
      CurrentUser.userID(),
      this.state.groupToDelete.group_id
    );
    this.setState({
      ownedGroup: _.pull(this.state.ownedGroups, this.state.groupToDelete),
    });
    this.forceUpdate();
  }

  async confirmDeleteProject(confirmedDelete: boolean): void {
    if (confirmedDelete) {
      const url =
        "/api/groups/delete/" + this.state.groupToDelete.group_id + "/";
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
      showConfirmDeleteModal: false,
    });
  }

  render(): React$Node {
    if (!CurrentUser.isLoggedIn) {
      return <LogInController prevPage={Section.MyGroups} />;
    }
    return (
      <React.Fragment>
        <div className="container MyProjectsController-root">
          <ConfirmationModal
            showModal={this.state.showConfirmDeleteModal}
            message="Are you sure you want to delete this group?"
            onSelection={this.confirmDeleteProject.bind(this)}
          />

          {!_.isEmpty(this.state.ownedGroups) &&
            this.renderGroupCollection("Owned Groups", this.state.ownedGroups)}
        </div>
      </React.Fragment>
    );
  }

  renderGroupCollection(
    title: string,
    groups: $ReadOnlyArray<MyGroupData>
  ): React$Node {
    return (
      <div>
        <h3>{title}</h3>
        {groups.map(group => {
          return (
            <MyGroupsCard
              key={group.group_name}
              group={group}
              onGroupClickDelete={this.clickDeleteGroup.bind(this)}
            />
          );
        })}
      </div>
    );
  }
}

export default MyGroupsController;
