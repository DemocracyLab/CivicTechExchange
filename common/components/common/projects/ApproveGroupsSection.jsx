// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import ProjectAPIUtils, {
  ProjectDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import CurrentUser, { MyGroupData } from "../../utils/CurrentUser.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import _ from "lodash";

type Props = {|
  project: ?ProjectDetailsAPIData,
|};
type State = {|
  pendingGroups: $ReadOnlyArray<MyGroupData>,
|};

/**
 * For approving/rejecting group invitations
 */

class ApproveGroupsSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      pendingGroups: this.getPendingGroups(props.project),
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return { pendingGroups: this.getPendingGroups(nextProps.project) };
  }

  getPendingGroups(
    project: ?ProjectDetailsAPIData
  ): $ReadOnlyArray<MyGroupData> {
    return (
      project &&
      project.project_groups.filter((group: MyGroupData) => {
        return (
          !group.relationship_is_approved &&
          CurrentUser.isCoOwnerOrOwner(project)
        );
      })
    );
  }

  removeGroupFromList(group: MyGroupData): void {
    const groups: $ReadOnlyArray<MyGroupData> = _.remove(
      this.state.pendingGroups,
      (g: MyGroupData) => g === group
    );
    this.setState({ pendingGroups: groups });
  }

  handleClick(group: MyGroupData, approved: boolean): void {
    // TODO: Add LoadingMessage while processing?
    // metrics.logGroupInviteProjectSubmitConfirm(this.state.selectedGroup.group_id, this.props.projectId);
    ProjectAPIUtils.post(
      "/api/invite/" +
        group.project_relationship_id +
        "/" +
        (approved ? "approve" : "reject"),
      {},
      response => this.removeGroupFromList(),
      response => null /* TODO: Report error to user */
    );
  }

  _renderGroupRow(group: MyGroupData, i: number): React$Node {
    return (
      <div key={i} className="ApproveGroups-row">
        <span className="ApproveGroups-logo">
          <img
            src={
              group && group.group_thumbnail
                ? group.group_thumbnail.publicUrl
                : "/static/images/projectlogo-default.png"
            }
          />
        </span>
        <span>
          <Button
            className="ApproveGroups-button-approve"
            variant="outline-secondary"
            onClick={this.handleClick.bind(this, group, true)}
          >
            Approve
          </Button>
        </span>
        <span>
          <Button
            className="ApproveGroups-button-reject"
            variant="outline-secondary"
            onClick={this.handleClick.bind(this, group, false)}
          >
            Reject
          </Button>
        </span>
        <span>
          for{" "}
          <a href={url.section(Section.AboutGroup, { id: group.group_id })}>
            {group.group_name}
          </a>
        </span>
      </div>
    );
  }

  render(): React$Node {
    return (
      <div className="ApproveGroups-section">
        {this.state.pendingGroups.map((group: MyGroupData, i: number) =>
          this._renderGroupRow(group, i)
        )}
      </div>
    );
  }
}

export default ApproveGroupsSection;
