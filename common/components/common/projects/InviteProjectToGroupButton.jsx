// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser, {
  UserContext,
  MyGroupData,
} from "../../utils/CurrentUser.js";
import metrics from "../../utils/metrics.js";
import InviteProjectToGroupModal from "./InviteProjectToGroupModal.jsx";
import { Dictionary, createDictionary } from "../../types/Generics.jsx";
import _ from "lodash";

type Props = {|
  project: ?ProjectDetailsAPIData,
|};
type State = {|
  projectGroups: $ReadOnlyArray<MyGroupData>,
  ownedGroups: $ReadOnlyArray<MyGroupData>,
  showModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string,
|};

/**
 * Button to open Modal for inviting project to join group
 */
class InviteProjectToGroupButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      projectGroups: props.project.project_groups,
      ownedGroups: CurrentUser.isLoggedIn() && userContext.owned_groups,
      showModal: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  getOwnedButNotInvitedGroups(
    myGroups: $ReadOnlyArray<MyGroupData>,
    invitedGroups: $ReadOnlyArray<MyGroupData>
  ): $ReadOnlyArray<MyGroupData> {
    if (!_.isEmpty(invitedGroups)) {
      const invitations: Dictionary<MyGroupData> = createDictionary(
        invitedGroups,
        (group: MyGroupData) => group.group_id
      );
      return myGroups.filter(
        (group: MyGroupData) => !(invitations && invitations[group.group_id])
      );
    } else {
      return myGroups;
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ projectGroups: nextProps.project.project_groups });
  }

  handleShow() {
    metrics.logGroupInviteProjectClick(
      CurrentUser.userID(),
      this.props.project.project_id
    );
    this.setState({ showModal: true });
  }

  closeModal(invitedGroup: ?MyGroupData) {
    const state: State = this.state;
    state.showModal = false;
    if (invitedGroup) {
      state.projectGroups.push(invitedGroup);
    }
    this.setState(state);
    this.forceUpdate();
  }

  displayInviteProjectButton(): ?React$Node {
    const ownedButNotInvitedGroups: $ReadOnlyArray<MyGroupData> = this.getOwnedButNotInvitedGroups(
      this.state.ownedGroups,
      this.state.projectGroups
    );
    if (!_.isEmpty(ownedButNotInvitedGroups)) {
      return (
        <div>
          <Button
            variant="primary"
            className="AboutProject-button"
            type="button"
            onClick={this.handleShow}
          >
            Invite Project to Group
          </Button>
          <InviteProjectToGroupModal
            groups={ownedButNotInvitedGroups}
            projectId={this.props.project.project_id}
            showModal={this.state.showModal}
            handleClose={this.closeModal}
          />
        </div>
      );
    }
  }

  render(): ?React$Node {
    return !_.isEmpty(this.state.ownedGroups) ? (
      <div>{this.displayInviteProjectButton()}</div>
    ) : null;
  }
}

export default InviteProjectToGroupButton;
