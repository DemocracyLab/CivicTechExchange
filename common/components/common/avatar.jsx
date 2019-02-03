// @flow

import React from 'react';
import Person from '@material-ui/icons/Person';
import type {UserAPIData} from "../../utils/UserAPIUtils"

type Props = {|
  +user: UserAPIData,
  +size: number
|};

class Avatar extends React.PureComponent<Props> {
  render(): React$Node {
    const user = this.props.user;
    return (
      user.user_thumbnail ?
        <img className="upload_img upload_img_bdr VolunteerCard-img" src={user.user_thumbnail.publicUrl} /> :
        <span className="Icon-container"><Person className="PersonIcon" style={{ fontSize: this.props.size }} /></span>
    );
  }
}

export default Avatar;
