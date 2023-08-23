// @flow

import React from "react";
// import moment from "moment";
import ActivityFeedDefaultAvatar from "../../../../svg/default-activity-feed-avatar.svg";
import datetime from "../../../../utils/datetime.js";

type ActionAuthorLineCommitProps = {
  user_name: string,
  user_avatar_link: string,
  action_date: Date,
  action_string?: string,
};
export default class ActionAuthorLine extends React.PureComponent<ActionAuthorLineCommitProps> {
  render(): React$Node {
    const {
      user_name,
      user_avatar_link,
      action_date, //2023-08-14T16:25:20.946Z
      action_string = "committed",
    } = this.props;
    return (
      <div className="ProjectCommitCard-line ProjectCommitCard-author-line">
        <div className="ProjectCommitCard-avatar">
          {user_avatar_link ? (
            <img
              src={user_avatar_link}
              alt={`${user_name} avatar`}
              width="30"
              height="30"
            />
          ) : (
            <ActivityFeedDefaultAvatar />
          )}
        </div>
        <div className="ProjectCommitCard-user">{user_name || "unknown"}</div>
        <div className="ProjectCommitCard-date">
          {action_string}{" "}
          {datetime.getDisplayDistance(new Date(), new Date(action_date))}
        </div>
      </div>
    );
  }
}
