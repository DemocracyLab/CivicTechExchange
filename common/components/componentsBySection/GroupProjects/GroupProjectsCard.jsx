// @flow

import React from "react";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import { Button } from "react-bootstrap";
import CurrentUser, { MyGroupData } from "../../utils/CurrentUser.js";
import UserAPIUtils from "../../utils/UserAPIUtils.js";
import {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";

type Props = {|
  +project: ProjectDetailsAPIData,
  +onGroupProjectClickRemove: ProjectDetailsAPIData => void,
|};

type State = {|
  +projectLead: string,
|};

class GroupProjectsCard extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
        projectLead: "",
    };
  }
  componentDidMount(){
    UserAPIUtils.fetchUserDetails(this.props.project.project_creator,(data)=>this.setState({projectLead:`${data.first_name} ${data.last_name}`}),()=>this.setState({projectLead:"Can not load name"}));
  }
  render(): React$Node {
    return (
      <div className="row GroupProjectCard-root">
        <div className="col-sm-4">
          <div className="GroupProjectCard-header">Project Name</div>
          <div className="GroupProjectCard-projectName text-break">
            {this.props.project.project_name}
          </div>
        </div>
        <div className="col-sm-2">
          <div className="GroupProjectCard-header">Project Lead</div>
          <div>{this.state.projectLead ? this.state.projectLead : "Loading"}</div>
        </div>
        <div className="col-sm-3">{this._renderProjectStatus()}</div>
        <div className="col-sm-3">{this._renderButtons()}</div>
      </div>
    );
  }

  _getProjectStatus(): string {
    const {project} = this.props;
    if (project.project_stage && project.project_stage.length!=0) {
      return this.props.project.project_stage[0].display_name;
    }
    return "None";
  }

  _renderProjectStatus(): React$Node {
    const status: string = this._getProjectStatus();

    return (
      <React.Fragment>
        <div className="GroupProjectCard-header">Project Status</div>
        <div>{status}</div>
      </React.Fragment>
    );
  }

  _renderButtons(): ?Array<React$Node> {
    const id = { id: this.props.project.project_id };
    let buttons: ?Array<React$Node> = [
      <Button
        className="GroupProjectCard-button"
        href={url.section(Section.AboutProject, id)}
        variant="secondary"
      >
        View
      </Button>,
      <Button
      className="GroupProjectCard-button"
      variant="destructive"
      onClick={() => this.props.onGroupProjectClickRemove(this.props.project)}
    >
      Remove
    </Button>,
    ];
    return buttons;
  }
}

export default GroupProjectsCard;
