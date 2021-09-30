// @flow

import React from "react";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import Button from "react-bootstrap/Button";
import CurrentUser, { MyProjectData } from "../../utils/CurrentUser.js";
import moment from "moment";

//TODO: Update
type MyProjectClickCallback = MyProjectData => void;

type Props = {|
  +project: MyProjectData,
  +onProjectClickDelete: ?MyProjectClickCallback,
  +onProjectClickRenew: ?MyProjectClickCallback,
  +onProjectClickConclude: ?MyProjectClickCallback,
|};

type State = {|
  +isOwner: boolean,
|};

export let getStatus = function(
  isOwner: boolean,
  project: MyProjectData
): string {
  let status = "";
  if (isOwner) {
    if (project.isApproved) {
      status = "Published";
    } else {
      status = project.isCreated ? "Under Review" : "Unpublished";
    }
  } else {
    if (project.isApproved) {
      status = project.isUpForRenewal
        ? "Expires on " + moment(project.projectedEndDate).format("l")
        : "Active";
    } else {
      status = "Pending";
    }
  }
  return status;
};

class MyProjectCard extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      isOwner:
        props.project.isCoOwner ||
        props.project.project_creator === CurrentUser.userID(),
    };
  }

  render(): React$Node {
    return (
      <div className="MyProjectCard-root">
        <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">Project Name</tr>
                <tr className="MyProjectCard-projectName">
                  {this.props.project.project_name}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">Your Role</tr>
                <tr>{this.state.isOwner ? "Project Lead" : "Volunteer"}</tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  {this.state.isOwner ? "Project Status" : "Volunteer Status"}
                </tr>
                <tr>{this._getStatus()}</tr>
              </td>
              <td className="MyProjectCard-column">{this._renderButtons()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  _getStatus(): string {
    return getStatus(this.state.isOwner, this.props.project);
  }

  _renderButtons(): ?Array<React$Node> {
    const id = { id: this.props.project.project_id };
    // TODO: Reorder buttons according to re-engagement spec
    let buttons: ?Array<React$Node> = [
      <Button
        key={"view" + id}
        className="MyProjectCard-button"
        href={url.section(Section.AboutProject, id)}
        variant="info"
      >
        View
      </Button>,
    ];

    if (this.state.isOwner) {
      buttons = buttons.concat([
        <Button
          key={"edit" + id}
          className="MyProjectCard-button"
          href={url.section(Section.CreateProject, id)}
          variant="info"
        >
          Edit
        </Button>,
        <Button
          key={"delete" + id}
          className="MyProjectCard-button"
          variant="danger"
          onClick={() => this.props.onProjectClickDelete(this.props.project)}
        >
          Delete
        </Button>,
      ]);
    }

    if (this.props.project.isApproved && this.props.project.isUpForRenewal) {
      buttons = buttons.concat([
        <Button
          key={"renew" + id}
          className="MyProjectCard-button"
          variant="warning"
          onClick={() => this.props.onProjectClickRenew(this.props.project)}
        >
          Renew
        </Button>,
        <Button
          key={"conclude" + id}
          className="MyProjectCard-button"
          variant="danger"
          onClick={() => this.props.onProjectClickConclude(this.props.project)}
        >
          Conclude
        </Button>,
      ]);
    }

    return buttons;
  }
}

export default MyProjectCard;
