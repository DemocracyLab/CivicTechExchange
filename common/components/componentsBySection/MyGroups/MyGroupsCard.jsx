// @flow

import React from "react";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import { Button } from "react-bootstrap";
import CurrentUser, { MyGroupData } from "../../utils/CurrentUser.js";

type Props = {|
  +group: MyGroupData,
  +onGroupClickDelete: MyGroupData => void,
|};

type State = {|
  +isOwner: boolean,
|};

class MyGroupsCard extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      isOwner: props.group.group_creator === CurrentUser.userID(),
    };
  }

  render(): React$Node {
    return (
      <div className="row MyProjectCard-root">
        <div className="col-sm-4">
          <div className="MyProjectCard-header">Group Name</div>
          <div className="MyProjectCard-projectName text-break">
            {this.props.group.group_name}
          </div>
        </div>
        <div className="col-sm-2">
          <div className="MyProjectCard-header">Your Role</div>
          <div>{this.state.isOwner ? "Group Owner" : "Volunteer"}</div>
        </div>
        <div className="col-sm-3">{this._renderGroupStatus()}</div>
        <div className="col-sm-3">{this._renderButtons()}</div>
      </div>
    );
  }

  _getGroupStatus(): string {
    if (this.state.isOwner) {
      return this.props.group.isApproved ? "Published" : "Unpublished";
    }

    if (!this.props.group.isApproved) {
      return "Awaiting Approval";
    }

    return "Active";
  }

  _renderGroupStatus(): React$Node {
    const header: string = this.state.isOwner
      ? "Group Status"
      : "Volunteer Status";
    const status: string = this._getGroupStatus();

    return (
      <React.Fragment>
        <div className="MyProjectCard-header">{header}</div>
        <div>{status}</div>
      </React.Fragment>
    );
  }

  _renderButtons(): ?Array<React$Node> {
    const id = { id: this.props.group.group_id };
    let buttons: ?Array<React$Node> = [
      <Button
        className="MyProjectCard-button"
        href={url.section(Section.AboutGroup, {
          id: this.props.group.slug || this.props.group.group_id,
        })}
        variant="secondary"
      >
        View
      </Button>,
    ];

    if (this.state.isOwner) {
      const editUrl: string = url.section(Section.CreateGroup, id);
      const projectsUrl:string = url.section(Section.GroupProjects,{group_id:id.id});
      buttons = buttons.concat([
        <Button
          className="MyProjectCard-button"
          href={editUrl}
          variant="secondary"
        >
          Edit
        </Button>,
        <Button
        className="MyProjectCard-button"
        // change href to manage page
        href={projectsUrl}
        variant="secondary"
        >
          Projects
        </Button>
        ,
        <Button
          className="MyProjectCard-button"
          variant="destructive"
          onClick={() => this.props.onGroupClickDelete(this.props.group)}
        >
          Delete
        </Button>,
      ]);
    }

    return buttons;
  }
}

export default MyGroupsCard;
