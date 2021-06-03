// @flow

import React from "react";
import LinkEntryModal from "./LinkEntryModal.jsx";
import type { LinkInfo } from "./LinkInfo.jsx";
import GlyphStyles, { Glyph, GlyphSizes } from "../utils/glyphs.js";
import type { Dictionary, KeyValuePair } from "../types/Generics.jsx";
import Sort from "../utils/sort.js";
import stringHelper from "../utils/string.js";
import _ from "lodash";

export type NewLinkInfo = {| tempId: ?string |} & LinkInfo;

type Props = {|
  elementid: string,
  linkDict: Dictionary<NewLinkInfo>,
  linkOrdering: $ReadOnlyArray<string>,
  title: string,
  subheader: string,
  linkNamePrefix: ?string,
  addLinkText: ?string,
  onAddLink: NewLinkInfo => void,
  onChangeLink: (string, SyntheticInputEvent<HTMLInputElement>) => void,
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingLink: LinkInfo,
  linkToDelete: LinkInfo,
  linkKeyOrdering: ?Array<string>,
|};

const linkCaptions: Dictionary<string> = {
  link_coderepo: "Code Repository (e.g. Github",
  link_messaging: "Communication (e.g. Slack)",
  link_projmanage: "Project Management (e.g. Trello)",
  link_filerepo: "File Repository (e.g. Google Drive)",
  social_twitter: "Twitter",
  social_facebook: "Facebook",
  social_linkedin: "LinkedIn",
};

/**
 * Lists hyperlinks and provides add/edit functionality for them
 */
class LinkList extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showAddEditModal: false,
      showDeleteModal: false,
      existingLink: null,
      linkToDelete: null,
    };
    if (props.linkDict) {
      this.state.linkKeyOrdering = this.generateLinkOrdering(props);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      _.isEmpty(this.state.linkKeyOrdering) ||
      nextProps.linkDict !== this.props.linkDict
    ) {
      this.setState({ linkKeyOrdering: this.generateLinkOrdering(nextProps) });
    }
  }

  generateLinkOrdering(props: Props): ?$ReadOnlyArray<string> {
    let ordering: ?$ReadOnlyArray<string> = null;
    if (props.linkDict) {
      let keyValPairs: Array<KeyValuePair<LinkInfo>> = _.entries(
        props.linkDict
      );
      ordering = Sort.byNamedEntries(
        keyValPairs,
        props.linkOrdering || [],
        (kvp: KeyValuePair<LinkInfo>) => kvp[0]
      ).map((kvp: KeyValuePair<LinkInfo>) => kvp[0]);
    }
    return ordering;
  }

  createNewLink(): void {
    this.state.existingLink = null;
    this.openModal();
  }

  onModalCancel(): void {
    this.setState({ showAddEditModal: false });
  }

  editLink(linkData: LinkInfo): void {
    this.state.existingLink = linkData;
    this.openModal();
  }

  saveLink(linkData: LinkInfo): void {
    if (!this.state.existingLink) {
      const newLinkData: NewLinkInfo = linkData;
      newLinkData.tempId = stringHelper.randomAlphanumeric();
      if (this.props.linkNamePrefix) {
        linkData.linkName = this.props.linkNamePrefix + linkData.linkName;
      }
      this.props.onAddLink(newLinkData);
    } else {
      _.assign(this.state.existingLink, linkData);
    }

    this.setState({ showAddEditModal: false });
    this.props.onChange && this.props.onChange();
  }

  openModal(): void {
    this.setState({ showAddEditModal: true });
  }

  editLinkUrl(linkKey: string, value: string): void {
    this.props.onChangeLink(linkKey, value);
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
        <input
          type="hidden"
          ref="hiddenFormField"
          id={this.props.elementid}
          name={this.props.elementid}
        />

        <h3>{this.props.title || "Links"}</h3>
        <p>{this.props.subheader}</p>

        {this._renderLinks()}

        <span className="add-link" onClick={this.createNewLink.bind(this)}>
          <i
            className={Glyph(GlyphStyles.Add, GlyphSizes.SM)}
            aria-hidden="true"
          ></i>
          {this.props.addLinkText}
        </span>

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
    return this.state.linkKeyOrdering.map((linkKey: string, i) => {
      const link: NewLinkInfo = this.props.linkDict[linkKey];
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

export default LinkList;
