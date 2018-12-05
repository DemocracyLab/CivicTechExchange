// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerUserData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  +owner: VolunteerUserData,
|};

class ProjectOwnerCard extends React.PureComponent<Props> {
  
  render(): React$Node {
    const owner: ?VolunteerUserData = this.props.owner;
    const ownerUrl:string = owner.user_thumbnail && owner.user_thumbnail.publicUrl;
    return (
      <div className="VolunteerCard-root">
        <a className="VolunteerCard-volunteerName" href={ownerUrl} target="_blank" rel="noopener noreferrer">
          <img className="upload_img upload_img_bdr VolunteerCard-img" src={owner && owner.user_thumbnail && owner.user_thumbnail.publicUrl}/>
        </a>
        <a className="VolunteerCard-volunteerName" href={ownerUrl} target="_blank" rel="noopener noreferrer">
          {owner && (owner.first_name + " " + owner.last_name)}
        </a> 
        {/* {this.props.isProjectAdmin ? this._renderShowApplicationMenu(volunteer) : null} */}
        <p className="VolunteerCard-volunteerRole">
          Project Owner
        </p>
      </div>
    );
  }
}

export default ProjectOwnerCard;
