// @flow

import React from "react";
import moment from "moment";

type TrelloAction = {|
  action_date: string,
  action_type: string,
  board_id: string,
  member_fullname: string,
  member_id: string
|};

type Props = {|
  action: TrelloAction,
|};

class TrelloActionCard extends React.PureComponent<Props> {
  render(): React$Node {
    const {
      action_date,
      action_type,
      board_id,
      member_fullname,
      member_id
    } = this.props.action;

    return (
      <div className="ProjectCommitCard-container">
        <div className="ProjectCommitCard-line ProjectCommitCard-author-line">
          <div className="ProjectCommitCard-avatar">
            {/* <img
              src={
                user_avatar_link ||
                `https://github.com/identicons/${user_name || "null"}.png`
              }
              alt={`${user_name} avatar`}
              width="30"
              height="30"
            /> */}
          </div>
          <div className="ProjectCommitCard-user">{member_fullname || "unknown"}</div>
          <div className="ProjectCommitCard-date">
            Perfomed a Trello action {moment(action_date).fromNow()}
          </div>
        </div>
        <div className="ProjectCommitCard-line">
          {/* <div className="ProjectCommitCard-commit-icon">
            <svg
              viewBox="0 0 14 16"
              version="1.1"
              width="21"
              height="24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"
              ></path>
            </svg>
          </div> */}
          {/* <div className="ProjectCommitCard-sha">{commit_sha.slice(0, 7)}</div> */}
          <div className="ProjectCommitCard-title">{action_type} on Board #{board_id}</div>
        </div>
        {/* <div className="ProjectCommitCard-line ProjectCommitCard-branch-line">
          to branch
          <strong>{branch_name}</strong>
          in repo
          <a
            href={`https://github.com/${repo_name}`}
            target="_blank"
            rel="noopener"
          >
            {repo_name}
          </a>
          on GitHub
        </div> */}
      </div>
    );
  }
}

export default TrelloActionCard;
