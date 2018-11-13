// @flow

import React from 'react';
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import {Button} from 'react-bootstrap';
import {ProjectData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";

type Props = {|
  +project: ProjectData,
  +onProjectClickDelete: (ProjectData) => void,
|};

type State = {|
  +isOwner: boolean
|};

class MyProjectCard extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      isOwner: (props.project.ownerId === CurrentUser.userID())
    };
  }
  
  render(): React$Node {
    return (
      <div className="MyProjectCard-root">
         <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Project Name
                </tr>
                <tr className="MyProjectCard-projectName">
                  {this.props.project.name}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Your Role
                </tr>
                <tr>{this.state.isOwner ? "Project Lead" : "Volunteer"}</tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Project Status
                </tr>
                <tr>In Progress</tr>
              </td>
              <td className="MyProjectCard-column">
                {this._renderButtons()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  _renderButtons(): ?Array<React$Node>  {
    const id = {'id':this.props.project.id};
    let buttons: ?Array<React$Node> = [
      <Button className="MyProjectCard-button" href={url.section(Section.AboutProject, id)} bsStyle="info">View</Button>
    ];
  
    if(this.state.isOwner){
      buttons = buttons.concat(
        [
            <Button className="MyProjectCard-button" href={url.section(Section.EditProject, id)} bsStyle="info">Edit</Button>,
            <Button className="MyProjectCard-button" bsStyle="danger" onClick={() => this.props.onProjectClickDelete(this.props.project)}>Delete</Button>
        ]);
    }
    
    return buttons;
  }
}

export default MyProjectCard;
