// @flow

import type { SectionType } from "../enums/Section.js";

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";

export type OffsetActionType = {
  type: "SET_HEADER_HEIGHT",
  headerHeight: number,
};

const DEFAULT_STATE = {
  headerHeight: 0,
};

class State extends Record(DEFAULT_STATE) {
  headerHeight: number;
}

// Store for broadcasting the header height to any components that need to factor it in
class PageOffsetStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    const state = new State();
    return state;
  }

  reduce(state: State, action: OffsetActionType): State {
    switch (action.type) {
      case "SET_HEADER_HEIGHT":
        return state.set("headerHeight", action.headerHeight);
      default:
        (action: empty);
        return state;
    }
  }

  getHeaderHeight(): number {
    return this.getState().headerHeight;
  }
}

export default new PageOffsetStore();
