// @flow

import React from "react";
import { Container } from "flux/utils";
import LinkEntryModal from "./LinkEntryModal.jsx";
import type { LinkInfo } from "./LinkInfo.jsx";
import GlyphStyles, { Glyph, GlyphSizes } from "../utils/glyphs.js";
import type { Dictionary, KeyValuePair } from "../types/Generics.jsx";
import Sort from "../utils/sort.js";
import stringHelper from "../utils/string.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import LinkListStore from "../stores/LinkListStore.js";
import {
  generateLinkKey,
  NewLinkInfo,
  linkCaptions,
} from "../stores/LinkListStore.js";
import _ from "lodash";

type Props = {|
  linkOrdering: $ReadOnlyArray<string>,
  title: string,
  subheader: string,
  linkNamePrefix: ?string,
  linkNamePrefixExclude: ?$ReadOnlyArray<string>,
  addLinkText: ?string,
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingLink: LinkInfo,
  linkToDelete: LinkInfo,
  linkDict: Dictionary<NewLinkInfo>,
  linkOrdering: $ReadOnlyArray<string>,
  linkKeyOrdering: ?Array<string>,
  presetLinks: $ReadOnlyArray<string>,
|};

/**
 * Lists hyperlinks and provides add/edit functionality for them
 * NOTE: This control should be paired with HiddenFormFields component when used in a form
 */
class LinkList extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showAddEditModal: false,
      showDeleteModal: false,
      existingLink: null,
      linkToDelete: null,
      linkOrdering: props.linkOrdering,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [LinkListStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.linkDict = LinkListStore.getLinkDictionary();
    state.linkKeyOrdering = this.generateLinkOrdering(props, state);
    state.presetLinks = LinkListStore.getPresetLinks();
    return state;
  }

  static generateLinkOrdering(
    props: ?Props,
    state: State
  ): ?$ReadOnlyArray<string> {
    const includeLinkName: string => boolean = (linkName: string) => {
      let exclude: boolean =
        props.linkNamePrefixExclude &&
        _.some(props.linkNamePrefixExclude, (prefix: string) =>
          _.startsWith(linkName, prefix)
        );
      if (exclude) {
        return false;
      } else {
        let include: boolean =
          !props.linkNamePrefix || _.startsWith(linkName, props.linkNamePrefix);
        return include || _.includes(props.linkOrdering, linkName);
      }
    };

    const linkOrdering: $ReadOnlyArray<string> =
      props.linkOrdering || state.linkOrdering;
    let ordering: ?$ReadOnlyArray<string> = null;
    if (state.linkDict) {
      let keyValPairs: Array<KeyValuePair<LinkInfo>> = _.entries(
        state.linkDict
      ).filter((kvp: KeyValuePair<NewLinkInfo>) =>
        includeLinkName(kvp[1].linkName)
      );
      ordering = Sort.byNamedEntries(
        keyValPairs,
        linkOrdering || [],
        (kvp: KeyValuePair<LinkInfo>) => kvp[0]
      ).map((kvp: KeyValuePair<LinkInfo>) => kvp[0]);
    }
    return ordering;
  }

  onModalCancel(): void {
    this.setState({ showAddEditModal: false });
  }

  saveLink(linkData: LinkInfo): void {
    if (!this.state.existingLink) {
      linkData.tempId = stringHelper.randomAlphanumeric();
      if (this.props.linkNamePrefix) {
        linkData.linkName = this.props.linkNamePrefix + linkData.linkName;
      }
      const linkKey: string = generateLinkKey(this.state.presetLinks, linkData);
      UniversalDispatcher.dispatch({
        type: "UPDATE_LINK",
        link: linkData,
        linkKey: linkKey,
      });
    } else {
      _.assign(this.state.existingLink, linkData);
    }

    this.setState({ showAddEditModal: false });
  }

  openNewLinkModal(): void {
    this.setState({ existingLink: null, showAddEditModal: true });
  }

  editLinkUrl(linkKey: string, input: SyntheticEvent<HTMLInputElement>): void {
    const link: NewLinkInfo = this.state.linkDict[linkKey];
    link.linkUrl = input.target.value;
    UniversalDispatcher.dispatch({
      type: "UPDATE_LINK",
      link: link,
      linkKey: linkKey,
    });
  }

  getLinkHeader(link: NewLinkInfo): string {
    if (link.linkName in linkCaptions) {
      return linkCaptions[link.linkName];
    } else {
      return this.props.linkNamePrefix
        ? stringHelper.trimStartString(link.linkName, this.props.linkNamePrefix)
        : link.linkName;
    }
  }

  render(): React$Node {
    return (
      <div className="LinkList">
        <h3>{this.props.title || "Links"}</h3>
        <p>{this.props.subheader}</p>

        <div className="form-offset">
          {this._renderLinks()}

          <span className="add-link" onClick={this.openNewLinkModal.bind(this)}>
            <i
              className={Glyph(GlyphStyles.Add, GlyphSizes.SM)}
              aria-hidden="true"
            ></i>
            {this.props.addLinkText}
          </span>
        </div>

        <LinkEntryModal
          showModal={this.state.showAddEditModal}
          existingLink={this.state.existingLink}
          onSaveLink={this.saveLink.bind(this)}
          onCancelLink={this.onModalCancel.bind(this)}
        />
      </div>
    );
  }

  _renderLinks(): Array<React$Node> {
    if (!_.isEmpty(this.state.linkKeyOrdering)) {
      return this.state.linkKeyOrdering.map((linkKey: string, i) => {
        const link: NewLinkInfo = this.state.linkDict[linkKey];
        const header: string = this.getLinkHeader(link);
        return (
          <div key={i} className="form-group">
            <label htmlFor={linkKey}>{header}</label>
            <input
              type="text"
              className="form-control"
              id={linkKey}
              name={linkKey}
              maxLength="2075"
              value={link.linkUrl}
              onChange={this.editLinkUrl.bind(this, linkKey)}
            />
          </div>
        );
      });
    }
  }
}

export default Container.create(LinkList, { withProps: true });
