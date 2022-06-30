// @flow

import { ReduceStore } from "flux/utils";
import TagDispatcher from "./TagDispatcher.js";
import { List, Record } from "immutable";

export type TagActionType =
  | {
      type: "INIT",
    }
  | {
      type: "SET_TAGS_DO_NOT_CALL_OUTSIDE_OF_STORE",
      tags: List<Tag>,
    };

// TODO: Condense redundant tag definitions
export type Tag = {|
  +caption: string,
  +category: string,
  +displayName: string,
  +id: number,
  +parent: string,
  +subcategory: string,
  +tagName: string,
|};

type TagAPIData = {|
  +caption: string,
  +category: string,
  +display_name: string,
  +id: number,
  +parent: string,
  +subcategory: string,
  +tag_name: string,
|};

const DEFAULT_STATE = {
  tags: List(),
};

class State extends Record(DEFAULT_STATE) {
  tags: List<Tag>;
}

// TODO: Delete after moving definitions elsewhere
class TagStore extends ReduceStore<State> {
  constructor(): void {
    super(TagDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: TagActionType): State {
    switch (action.type) {
      case "INIT":
        this._init();
        return new State();
      case "SET_TAGS_DO_NOT_CALL_OUTSIDE_OF_STORE":
        return state.set("tags", action.tags);
      default:
        (action: empty);
        return state;
    }
  }

  _init(): void {
    fetch(new Request("/api/tags"))
      .then(response => response.json())
      .then(tags =>
        TagDispatcher.dispatch({
          type: "SET_TAGS_DO_NOT_CALL_OUTSIDE_OF_STORE",
          tags: List(tags.map(this._tagFromAPIData)),
        })
      );
  }

  _tagFromAPIData(apiData: TagAPIData): Tag {
    return {
      caption: apiData.caption,
      category: apiData.category,
      displayName: apiData.display_name,
      id: apiData.id,
      parent: apiData.parent,
      subcategory: apiData.subcategory,
      tagName: apiData.tag_name,
    };
  }

  getTags(): List<Tag> {
    return this.getState().tags;
  }

  getIssueAreas(): List<Tag> {
    return this.getState().tags.filter(
      tag => tag.category === "Issue(s) Addressed"
    );
  }
}

export default new TagStore();
