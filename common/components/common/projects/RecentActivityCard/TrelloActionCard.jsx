// @flow

import React from "react";

import ActionAuthorLine from "./components/ActionAuthorLine.jsx";

type TrelloAction = {
  action_date: Date,
  action_type: string,
  board_id: string,
  member_fullname: string,
  member_avatar_url: string,
  member_id: string,
};

type Props = {
  action: TrelloAction,
};

class TrelloActionCard extends React.PureComponent<Props> {
  render(): React$Node {
    const {
      action_date,
      action_type,
      board_id,
      member_fullname,
      member_avatar_url,
    } = this.props.action;

    return (
      <div className="ProjectCommitCard-container">
        <ActionAuthorLine
          user_name={member_fullname}
          user_avatar_link={member_avatar_url}
          action_date={action_date}
          action_string={"Perfomed a Trello action"}
        />
        <div className="ProjectCommitCard-line">
          <div className="ProjectCommitCard-title">
            {action_type} on Board #{board_id}
          </div>
        </div>
      </div>
    );
  }
}

export default TrelloActionCard;
