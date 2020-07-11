// @flow

import React from 'react';
import {Container, ReduceStore} from "flux/utils";
import Button from 'react-bootstrap/Button';
import MyGroupsStore, {MyGroupsAPIResponse, MyGroupData} from "../../stores/MyGroupsStore.js";
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import metrics from "../../utils/metrics.js";
import InviteProjectToGroupModal from "./InviteProjectToGroupModal.jsx";
import _ from "lodash";

type Props = {|
  project: ?ProjectDetailsAPIData
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  ownedGroups: $ReadOnlyArray<MyGroupData>,
  showModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string
|};

/**
 * Button to open Modal for inviting project to join group
 */
class InviteProjectToGroupButton extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      project: props.project,
      showModal: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  
  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [MyGroupsStore];
  }
  
  static calculateState(prevState: State): State {
    const myGroups: MyGroupsAPIResponse = MyGroupsStore.getMyGroups();
    // TODO: Filter out groups that this project is already a part of
    return {
      ownedGroups: myGroups && myGroups.owned_groups,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({project: nextProps.project});
  }

  handleShow() {
    metrics.logGroupInviteProjectClick(CurrentUser.userID(), this.props.project.project_id);
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  displayInviteProjectButton(): ?React$Node {
    const buttonText: string = "Invite Project to Group";
    // TODO: Hide when project is already subscribed to all groups
    if (CurrentUser.userID() !== this.props.project.project_creator) {
    return (
      <div>
        <Button
          variant="primary"
          className="AboutProject-button"
          type="button"
          title={buttonText}
          onClick={this.handleShow}
        >
          {buttonText}
        </Button>
        <InviteProjectToGroupModal
          groups={this.state.ownedGroups}
          projectId={this.props.project.project_id}
          showModal={this.state.showModal}
          handleSubmission={this.closeModal}
          handleClose={this.closeModal}
        />
      </div>
      );
    }
  }

  render(): ?React$Node {
    return !_.isEmpty(this.state.ownedGroups)
    ? (
        <div>
          {this.displayInviteProjectButton()}
        </div>
      )
    : null
  }
}

export default Container.create(InviteProjectToGroupButton);