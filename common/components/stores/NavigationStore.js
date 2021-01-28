// @flow

import type { SectionType } from "../enums/Section.js";

import { ReduceStore } from "flux/utils";
import UniversalDispatcher from "./UniversalDispatcher.js";
import { Record } from "immutable";
import Section from "../enums/Section.js";
import url from "../utils/url.js";

export type NavigationActionType = {
  type: "SET_SECTION",
  section: SectionType,
  url: string,
  fromUrl: ?boolean,
};

const DEFAULT_STATE = {
  section: Section.FindProjects,
  url: url.section(Section.FindProjects, { showSplash: 1 }),
};

class State extends Record(DEFAULT_STATE) {
  section: SectionType;
  url: string;
}

class NavigationStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    const state = new State();
    return state;
  }

  reduce(state: State, action: NavigationActionType): State {
    switch (action.type) {
      case "SET_SECTION":
        if (action.fromUrl) {
          history.replaceState({}, "", action.url);
        } else {
          history.pushState({}, "", action.url);
        }
        return state.set("section", action.section);
      default:
        (action: empty);
        return state;
    }
  }

  getSection(): SectionType {
    return this.getState().section;
  }
}

export default new NavigationStore();
