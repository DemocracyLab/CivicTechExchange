// @flow

import React from "react";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import { Button } from "react-bootstrap";
import { MyGroupData } from "../../stores/MyGroupsStore.js";
import CurrentUser from "../../utils/CurrentUser.js";

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
      <div className="MyProjectCard-root">
        <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">Group Name</tr>
                <tr className="MyProjectCard-projectName">
                  {this.props.group.group_name}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">Your Role</tr>
                <tr>{this.state.isOwner ? "Group Owner" : "Volunteer"}</tr>
              </td>
              <td className="MyProjectCard-column">
                {this._renderGroupStatus()}
              </td>
              <td className="MyProjectCard-column">{this._renderButtons()}</td>
            </tr>
          </tbody>
        </table>
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
        <tr className="MyProjectCard-header">{header}</tr>
        <tr>{status}</tr>
      </React.Fragment>
    );
  }

  _renderButtons(): ?Array<React$Node> {
    const id = { id: this.props.group.group_id };
    let buttons: ?Array<React$Node> = [
      <Button
        className="MyProjectCard-button"
        href={url.section(Section.AboutGroup, id)}
        variant="info"
      >
        View
      </Button>,
    ];

    if (this.state.isOwner) {
      const editUrl: string = url.section(Section.CreateGroup, id);
      buttons = buttons.concat([
        <Button className="MyProjectCard-button" href={editUrl} variant="info">
          Edit
        </Button>,
        <Button
          className="MyProjectCard-button"
          variant="danger"
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
