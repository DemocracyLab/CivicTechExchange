// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerUserData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Avatar from "../avatar.jsx"

type Props = {|
  +owner: VolunteerUserData,
|};

class ProjectOwnerCard extends React.PureComponent<Props> {

  render(): React$Node {
    const owner: ?VolunteerUserData = this.props.owner;
    const ownerUrl:string = url.section(Section.Profile, {id: owner.id});
    return (
      <div className="VolunteerCard-root">
        <a className="VolunteerCard-volunteerName" href={ownerUrl}>
          <Avatar user={owner} size={50} />
        </a>
        <a className="VolunteerCard-volunteerName" href={ownerUrl}>
          {owner && (owner.first_name + " " + owner.last_name)}
        </a>
        <p className="VolunteerCard-volunteerRole">
          Project Owner
        </p>
      </div>
    );
  }
}

export default ProjectOwnerCard;
