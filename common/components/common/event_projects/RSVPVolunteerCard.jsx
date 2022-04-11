// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Avatar from "../avatar.jsx";
import { VolunteerRSVPDetailsAPIData } from "../../utils/EventProjectAPIUtils.js";

type Props = {|
  +volunteer: VolunteerRSVPDetailsAPIData,
|};

class RSVPVolunteerCard extends React.PureComponent<Props> {
  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const volunteerUrl: string = url.section(Section.Profile, {
      id: volunteer.id,
    });
    return (
      <div className="VolunteerCard-root">
        <a
          className="VolunteerCard-volunteerName"
          href={volunteerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Avatar user={volunteer} />
        </a>
        <a
          className="VolunteerCard-volunteerName"
          href={volunteerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {volunteer && volunteer.first_name + " " + volunteer.last_name}
        </a>
        <p className="VolunteerCard-volunteerRole">{roleTag[0].display_name}</p>
      </div>
    );
  }
}

export default RSVPVolunteerCard;
