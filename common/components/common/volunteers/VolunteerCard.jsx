// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean
|};

class VolunteerCard extends React.PureComponent<Props> {
  
  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    return (
      <div className="MyProjectCard-root">
         <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <a
                   href={url.section(Section.Profile, {id: volunteer.id})}
                   target="_blank" rel="noopener noreferrer"
                >
                  {/*TODO: Change to pointer when hovering over image*/}
                  <img className="upload_img upload_img_bdr" src={volunteer && volunteer.user_thumbnail && volunteer.user_thumbnail.publicUrl}/>
                </a>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Name
                </tr>
                <tr className="MyProjectCard-projectName">
                  {volunteer && (volunteer.first_name + " " + volunteer.last_name)}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Role
                </tr>
                <tr>{roleTag && roleTag.display_name}</tr>
              </td>
              {this._renderApplicationButtons()}
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
            <Button className="MyProjectCard-button">Application</Button>
          </td>),
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" bsStyle="info">Accept</Button>
          </td>),
          (<td className="MyProjectCard-column">
            <Button className="MyProjectCard-button" bsStyle="danger">Reject</Button>
          </td>)
      ]);
  }
}

export default VolunteerCard;
