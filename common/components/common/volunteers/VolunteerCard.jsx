// @flow

import React from 'react';
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import {Button} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition} from "../../utils/ProjectAPIUtils.js";

type Props = {|
  +volunteer: VolunteerDetailsAPIData,
|};

const style = {
  textDecoration: 'none'
}

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
                <div>
                  <img className="upload_img upload_img_bdr" src={volunteer && volunteer.user_thumbnail && volunteer.user_thumbnail.publicUrl}/>
                </div>
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
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Approved
                </tr>
                <tr>
                  {this.props.volunteer && this.props.volunteer.isApproved}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                  <Button className="MyProjectCard-button" href={url.section(Section.Profile, {id: volunteer.id})} bsStyle="info">View</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default VolunteerCard;
