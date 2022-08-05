// @flow

import React from "react";

import ActionAuthorLine from "./components/ActionAuthorLine.jsx";
import AllowMarkdown from "../../richtext/AllowMarkdown.jsx";

const TrelloActionType = {
  CARD_CREATED: "CARD_CREATED",
  CARD_MOVED_LIST: "CARD_MOVED_LIST",
  CARD_MOVED_POS: "CARD_MOVED_POS",
  CARD_COMMENT: "CARD_COMMENT",
  CARD_ATTACHMENT: "CARD_ATTACHMENT",
  CARD_CHECKLIST_ADDED: "CARD_CHECKLIST_ADDED",
  CARD_CHECKLIST_ITEM_UPDATE: "CARD_CHECKLIST_ITEM_UPDATE",
  GENERAL_UPDATE: "GENERAL_UPDATE",
};

type TrelloActionActionData = {
  attachment?: {
    previewUrl?: string,
  },
  board?: {
    shortLink: string,
    name: string,
  },
  card?: {
    name?: string,
    shortLink?: string,
  },
  checkItem?: {
    name?: string,
    state?: string,
  },
  checklist?: {
    name?: string,
  },
  list?: {
    name: string,
  },
  listAfter?: {
    name: string,
  },
  listBefore?: {
    name: string,
  },
  text?: string,
  old?: {
    pos?: number,
    idList: string,
  },
};

type TrelloAction = {
  action_data: TrelloActionActionData,
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
  getBoardUrl(): string {
    const { board } = this.props.action.action_data;
    return board?.shortLink ? `http://trello.com/b/${board?.shortLink}` : "#";
  }

  getCardUrl(): string {
    const { card } = this.props.action.action_data;
    return card?.shortLink ? `http://trello.com/c/${card?.shortLink}` : "#";
  }

  getTrelloActionType(): string {
    const { action_data, action_type } = this.props.action;
    if (action_type === "createCard") {
      return TrelloActionType.CARD_CREATED;
    } else if (action_type === "commentCard") {
      return TrelloActionType.CARD_COMMENT;
    } else if (action_type === "addAttachmentToCard") {
      return TrelloActionType.CARD_ATTACHMENT;
    } else if (action_type === "addChecklistToCard") {
      return TrelloActionType.CARD_CHECKLIST_ADDED;
    } else if (action_type === "updateCheckItemStateOnCard") {
      return TrelloActionType.CARD_CHECKLIST_ITEM_UPDATE;
    } else if (action_data?.old?.idList) {
      return TrelloActionType.CARD_MOVED_LIST;
    } else if (action_data?.old?.pos) {
      return TrelloActionType.CARD_MOVED_POS;
    }
    return TrelloActionType.GENERAL_UPDATE;
  }

  getTrelloActionDisplayInfo(): React$Node {
    const { action_data } = this.props.action;
    switch (this.getTrelloActionType()) {
      case TrelloActionType.CARD_CREATED:
        return (
          <p>
            Created{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>{" "}
            in {action_data.list?.name}
          </p>
        );
      case TrelloActionType.CARD_COMMENT:
        return (
          <>
            <p>
              Commented on{" "}
              <a target="_blank" href={this.getCardUrl()}>
                {action_data?.card?.name}
              </a>{" "}
            </p>
            <p className="ProjectCommitCard-comment">
              <AllowMarkdown children={action_data?.text} />
            </p>
          </>
        );
      case TrelloActionType.CARD_ATTACHMENT:
        return (
          <p>
            Uploaded{" "}
            {action_data?.attachment?.previewUrl ? (
              <a target="_blank" href={action_data?.attachment?.previewUrl}>
                an item
              </a>
            ) : (
              "an item"
            )}{" "}
            to{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>{" "}
            in {action_data.list?.name}
          </p>
        );
      case TrelloActionType.CARD_MOVED_LIST:
        return (
          <p>
            Moved{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>{" "}
            from {action_data.listBefore?.name} to {action_data.listAfter?.name}
          </p>
        );
      case TrelloActionType.CARD_MOVED_POS:
        return (
          <p>
            Moved{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>{" "}
            position within {action_data?.list?.name}
          </p>
        );
      case TrelloActionType.CARD_CHECKLIST_ADDED:
        return (
          <p>
            Added checklist "{action_data?.checklist?.name}" to{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>
          </p>
        );
      case TrelloActionType.CARD_CHECKLIST_ITEM_UPDATE:
        return (
          <p>
            Marked "{action_data?.checkItem?.name}"{" "}
            {action_data?.checkItem?.state} in checklist{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.checklist?.name}
            </a>
          </p>
        );
      default:
        return (
          <p>
            Updated{" "}
            <a target="_blank" href={this.getCardUrl()}>
              {action_data?.card?.name}
            </a>{" "}
            in {action_data.list?.name}
          </p>
        );
    }
  }

  render(): React$Node {
    const {
      action_date,
      member_fullname,
      member_avatar_url,
    } = this.props.action;

    return (
      <div className="ProjectCommitCard-container">
        <ActionAuthorLine
          user_name={member_fullname}
          user_avatar_link={member_avatar_url}
          action_date={action_date}
          action_string={"Performed a Trello action"}
        />
        <div className="ProjectCommitCard-line">
          <div className="ProjectCommitCard-title">
            {this.getTrelloActionDisplayInfo()}
          </div>
        </div>
      </div>
    );
  }
}

export default TrelloActionCard;
