// @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import type { LinkInfo } from "../forms/LinkInfo.jsx";
import type { Dictionary } from "../types/Generics.jsx";
import Visibility from "../common/Visibility.jsx";
import { createDictionary } from "../types/Generics.jsx";
import url from "../utils/url.js";
import stringHelper from "../utils/string.js";
import { LinkTypes } from "../constants/LinkConstants.js";
import _ from "lodash";

export const linkCaptions: Dictionary<string> = _.fromPairs([
  [LinkTypes.CODE_REPOSITORY, "Code Repository (e.g. Github)"],
  [LinkTypes.MESSAGING, "Communication (e.g. Slack)"],
  [LinkTypes.PROJECT_MANAGEMENT, "Project Management (e.g. Trello)"],
  [LinkTypes.FILE_REPOSITORY, "File Repository (e.g. Google Drive)"],
  [LinkTypes.DESIGN, "Design Files (e.g. Figma)"],
  [LinkTypes.TWITTER, "Twitter"],
  [LinkTypes.FACEBOOK, "Facebook"],
  [LinkTypes.LINKED_IN, "LinkedIn"],
]);

export type NewLinkInfo = {| tempId: ?string |} & LinkInfo;

type SetLinkActionType = {
  type: "SET_LINK_LIST",
  links: $ReadOnlyArray<LinkInfo>,
  presetLinks: $ReadOnlyArray<string>,
};

type UpdateLinkActionType = {
  type: "UPDATE_LINK",
  link: NewLinkInfo,
  linkKey: string,
};

export type LinkListActionType = SetLinkActionType | UpdateLinkActionType;

const DEFAULT_STATE = {};

class State extends Record(DEFAULT_STATE) {
  presetLinks: $ReadOnlyArray<string>;
  links: Array<NewLinkInfo>;
  linkDict: Dictionary<NewLinkInfo>;
  linkErrors: Array<string>;
}

export function generateLinkKey(
  presetLinks: $ReadOnlyArray<string>,
  link: NewLinkInfo
): string {
  if (_.includes(presetLinks, link.linkName)) {
    return link.linkName;
  } else {
    const id: string = link.tempId || link.id;
    return link.linkName + id;
  }
}

// Store for broadcasting the header height to any components that need to factor it in
class LinkListStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    const state = new State();
    return state;
  }

  reduce(state: State, action: LinkListActionType): State {
    switch (action.type) {
      case "SET_LINK_LIST":
        return this.generateLinkDicts(state, action);
      case "UPDATE_LINK":
        return this.updateLink(state, action);
      default:
        (action: empty);
        return state;
    }
  }

  generateBlankLink(linkName: string): NewLinkInfo {
    const link: NewLinkInfo = {
      tempId: stringHelper.randomAlphanumeric(),
      linkName: linkName,
      linkUrl: "",
      visibility: Visibility.PUBLIC,
    };
    return link;
  }

  generateLinkDicts(state: State, action: SetLinkActionType): State {
    // Generate blank links for presets
    state.links = action.links;
    state.presetLinks = action.presetLinks;
    let linkDict: Dictionary<NewLinkInfo> = createDictionary(
      action.presetLinks,
      (key: string) => key,
      (key: string) => this.generateBlankLink(key)
    );
    // Merge in existing links
    const existingLinks: $ReadOnlyArray<NewLinkInfo> = createDictionary(
      action.links,
      (link: NewLinkInfo) => generateLinkKey(state.presetLinks, link),
      (link: NewLinkInfo) => link
    );
    state.linkDict = Object.assign(linkDict, existingLinks);
    state.linkErrors = this.checkLinkErrors(state);
    return state;
  }

  checkLinkErrors(state: State): $ReadOnlyArray<string> {
    const checkFunc: NewLinkInfo => boolean = (link: NewLinkInfo) => {
      return url.isEmptyStringOrValidUrl(link.linkUrl);
    };
    const errorMsg: NewLinkInfo => string = (link: NewLinkInfo) => {
      const linkName: string =
        link.linkName in linkCaptions
          ? linkCaptions[link.linkName]
          : stringHelper.trimStartString(link.linkName, ["link_", "social_"]);
      return "Please enter valid URL for " + linkName;
    };
    return _.values(state.linkDict)
      .filter((link: NewLinkInfo) => {
        return !checkFunc(link);
      })
      .map((link: NewLinkInfo) => {
        return errorMsg(link);
      });
  }

  updateLink(state: State, action: UpdateLinkActionType): State {
    state.links = _.clone(state.links);
    state.linkDict[action.linkKey] = action.link;
    state.linkDict = _.clone(state.linkDict);
    state.linkErrors = this.checkLinkErrors(state);
    return _.clone(state);
  }

  getLinkList(): ?$ReadOnlyArray<NewLinkInfo> {
    const links: ?$ReadOnlyArray<NewLinkInfo> = _.values(
      this.getLinkDictionary()
    );
    return links.filter((link: NewLinkInfo) => link.linkUrl);
  }

  getLinkDictionary(): ?Dictionary<NewLinkInfo> {
    return this.getState().linkDict;
  }

  getLinkErrors(): $ReadOnlyArray<string> {
    return this.getState().linkErrors;
  }

  getPresetLinks(): $ReadOnlyArray<string> {
    return this.getState().presetLinks;
  }
}

export default new LinkListStore();
