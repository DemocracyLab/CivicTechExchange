// @flow

import React from "react";
import Person from "../svg/person.svg";
import type { UserAPIData } from "../../utils/UserAPIUtils";

type Props = {|
  +user: UserAPIData,
  +imgClass: string,
|};

class Avatar extends React.PureComponent<Props> {
  render(): React$Node {
    const user = this.props.user;
    return user.user_thumbnail ? (
      <img
        className={this.props.imgClass || "VolunteerCard-img"}
        src={user.user_thumbnail.publicUrl}
      />
    ) : (
      <span className="person-icon-container">
        <Person className="PersonIcon" />
      </span>
    );
  }
}

export default Avatar;
