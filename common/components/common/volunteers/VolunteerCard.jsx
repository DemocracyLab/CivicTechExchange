// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean,
  +onOpenApplication: (VolunteerDetailsAPIData) => void,
  +onApproveButton: (VolunteerDetailsAPIData) => void,
  +onRejectButton: (VolunteerDetailsAPIData) => void
|};

class VolunteerCard extends React.PureComponent<Props> {
  
  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const volunteerUrl:string = url.section(Section.Profile, {id: volunteer.id});
    return (
      <div className="MyProjectCard-root">
         <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <a href={volunteerUrl} target="_blank" rel="noopener noreferrer">
                  {/*TODO: Change to pointer when hovering over image*/}
                  <img className="upload_img upload_img_bdr" src={volunteer && volunteer.user_thumbnail && volunteer.user_thumbnail.publicUrl}/>
                </a>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Name
                </tr>
                <tr className="MyProjectCard-projectName">
                  <a href={volunteerUrl} target="_blank" rel="noopener noreferrer">
                    {volunteer && (volunteer.first_name + " " + volunteer.last_name)}
                  </a>
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Role
                </tr>
                <tr>{roleTag && roleTag.display_name}</tr>
              </td>
              {this.props.isProjectAdmin ? this._renderApplicationButtons() : null}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  _renderApplicationButtons(): ?Array<React$Node>  {
    return (this.props.volunteer && this.props.volunteer.isApproved
      ? [
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" bsStyle="danger">Remove</Button>
          </td>)
        ]
      : [
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" onClick={() => this.props.onOpenApplication(this.props.volunteer)}>
              Application
            </Button>
          </td>),
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" bsStyle="info" onClick={() => this.props.onApproveButton(this.props.volunteer)}>
              Accept
            </Button>
          </td>),
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" bsStyle="danger" onClick={() => this.props.onRejectButton(this.props.volunteer)}>
              Reject
            </Button>
          </td>)
      ]);
  }
}

export default VolunteerCard;
