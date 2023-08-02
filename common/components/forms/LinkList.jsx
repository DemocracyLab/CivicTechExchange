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
import FormFieldsStore from "../stores/FormFieldsStore.js";
import _ from "lodash";
import { createDictionary } from "../types/Generics.jsx";
import TextFormField, { TextFormFieldType } from "./fields/TextFormField.jsx";
import { FormFieldValidator } from "../utils/validation.js";
import urlHelper from "../utils/url.js";
import Visibility from "../common/Visibility.jsx";
import { LinkTypes } from "../constants/LinkConstants";

export const linkCaptions: Dictionary<string> = _.fromPairs([
  [LinkTypes.CODE_REPOSITORY, "Code Repository (e.g. Github)"],
  [LinkTypes.MESSAGING, "Communication (e.g. Slack)"],
  [LinkTypes.PROJECT_MANAGEMENT, "Project Management (e.g. Trello)"],
  [LinkTypes.FILE_REPOSITORY, "File Repository (e.g. Google Drive)"],
  [LinkTypes.DESIGN, "Design Files (e.g. Figma)"],
  [LinkTypes.TWITTER, "Twitter"],
  [LinkTypes.FACEBOOK, "Facebook"],
  [LinkTypes.LINKED_IN, "LinkedIn"],
  [LinkTypes.VIDEO, "YouTube link"],
]);

export type NewLinkInfo = {| tempId: ?string |} & LinkInfo;

type Props = {|
  linkOrdering: $ReadOnlyArray<string>,
  title: string,
  subheader: string,
  linkNamePrefix: ?string,
  linkNamePrefixExclude: ?$ReadOnlyArray<string>,
  addLinkText: ?string,
  links: $ReadOnlyArray<LinkInfo>,
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingLink: LinkInfo,
  linkToDelete: LinkInfo,
  linkDict: Dictionary<NewLinkInfo>,
  linkOrdering: $ReadOnlyArray<string>,
  linkKeyOrdering: $ReadOnlyArray<string>,
  presetLinks: $ReadOnlyArray<string>,
|};

// TODO: Unit test
/**
 * Update old links from form fields
 * @param oldLinks  Links to be updated
 * @param linkFields  Form field values
 * @returns Updated links
 */
export function compileLinkFormFields(
  oldLinks: $ReadOnlyArray<LinkInfo>,
  linkFields: Dictionary<string>
): $ReadOnlyArray<NewLinkInfo> {
  // Remove blank links
  let linkDict: Dictionary<NewLinkInfo> = !_.isEmpty(oldLinks)
    ? createDictionary(
        oldLinks.filter(
          (link: LinkInfo) => !_.isEmpty(linkFields[link.linkName])
        ),
        (link: LinkInfo) => link.linkName
      )
    : {};

  // Merge new links into old links
  _.keys(linkFields).forEach((urlKey: string) => {
    let url: string = linkFields[urlKey];
    if (!_.isEmpty(url)) {
      url = urlHelper.appendHttpIfMissingProtocol(url);
      if (urlKey in linkDict) {
        linkDict[urlKey].linkUrl = url;
      } else {
        linkDict[urlKey] = LinkList.createLink(urlKey, url);
      }
    }
  });

  return _.values(linkDict);
}

/**
 * Lists hyperlinks and provides add/edit functionality for them
 * NOTE: This control should be paired with HiddenFormFields component when used in a form
 */
class LinkList extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const linkDict = LinkList.generateLinkDict(props);
    this.state = {
      showAddEditModal: false,
      showDeleteModal: false,
      existingLink: null,
      linkToDelete: null,
      linkOrdering: props.linkOrdering,
      linkDict: linkDict,
    };
    this.state = LinkList.generateLinkOrdering(props, this.state);

    UniversalDispatcher.dispatch({
      type: "ADD_FORM_FIELDS",
      formFieldValues: createDictionary(
        _.keys(this.state.linkDict),
        linkName => linkName,
        linkName => this.state.linkDict[linkName].linkUrl
      ),
      validators: this.generateLinkValidators(this.state.linkDict),
    });
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    // Get link fields from store
    if (!_.isEmpty(state.linkDict)) {
      const formFieldValues: Dictionary<string> = FormFieldsStore.getFormFieldValues();
      const links: $ReadOnlyArray<NewLinkInfo> = _.pick(
        formFieldValues,
        _.keys(state.linkDict)
      );
      state = this.updateLinkDict(state, links);
      state = this.generateLinkOrdering(props, state);
    }
    return state;
  }

  static includeLinkName(props: Props, linkName: string): boolean {
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
  }

  static generateLinkDict(props: Props): Dictionary<NewLinkInfo> {
    const _links: $ReadOnlyArray<NewLinkInfo> = props.links;
    let linkDict: Dictionary<NewLinkInfo> = !_.isEmpty(_links)
      ? createDictionary(_links, (link: LinkInfo) => link.linkName)
      : {};
    // Generate missing presetLinks
    const blankPresetLinkNames: Array<string> = props.linkOrdering.filter(
      (linkName: string) => !linkDict[linkName]
    );
    if (!_.isEmpty(blankPresetLinkNames)) {
      linkDict = Object.assign(
        linkDict,
        createDictionary(
          blankPresetLinkNames,
          linkName => linkName,
          (linkName: string) => LinkList.createLink(linkName)
        )
      );
    }

    return linkDict;
  }

  static updateLinkDict(state: State, linkValues: ?Dictionary<string>): State {
    state.linkDict = _.clone(state.linkDict);
    _.keys(linkValues).forEach((linkName: string) => {
      if (linkName in state.linkDict) {
        state.linkDict[linkName].linkUrl = linkValues[linkName];
      } else {
        const newLink: NewLinkInfo = LinkList.createLink(
          linkName,
          linkValues[linkName]
        );
        state.linkDict[linkName] = newLink;
      }
    });

    return state;
  }

  static generateLinkOrdering(props: ?Props, state: State): State {
    const linkOrdering: $ReadOnlyArray<string> =
      props.linkOrdering || state.linkOrdering;
    if (state.linkDict) {
      let keyValPairs: Array<KeyValuePair<LinkInfo>> = _.entries(
        state.linkDict
      ).filter((kvp: KeyValuePair<NewLinkInfo>) =>
        this.includeLinkName(props, kvp[1].linkName)
      );
      state.linkKeyOrdering = Sort.byNamedEntries(
        keyValPairs,
        linkOrdering || [],
        (kvp: KeyValuePair<LinkInfo>) => kvp[0]
      ).map((kvp: KeyValuePair<LinkInfo>) => kvp[0]);
    }
    return state;
  }

  generateLinkValidators(
    linkDict: Dictionary<NewLinkInfo>
  ): $ReadOnlyArray<FormFieldValidator<any>> {
    const getLinkError: string => ?string = (linkName, formFields) => {
      const linkUrl: string = formFields[linkName];
      return _.isEmpty(linkUrl) || urlHelper.isValidUrl(linkUrl);
    };

    const getLinkErrorMsg: string => ?string = (linkName, formFields) => {
      // const linkUrl: string = formFields[linkName];
      // const linkPrettyName: string =
      //   linkName in linkCaptions
      //     ? linkCaptions[linkName]
      //     : stringHelper.trimStartString(linkName, LinkTypePrefixes);
      // return "Please enter valid URL for " + linkPrettyName;
      // TODO: Support separate bottom error message
      return "Please enter valid URL";
    };

    const generateLinkValidator: NewLinkInfo => FormFieldValidator = (
      link: NewLinkInfo
    ) => {
      return {
        fieldName: link.linkName,
        checkFunc: getLinkError.bind(this, link.linkName),
        errorMessage: getLinkErrorMsg.bind(this, link.linkName),
      };
    };

    const validators = _.keys(linkDict).map((linkName: string) =>
      generateLinkValidator(linkDict[linkName])
    );
    return validators;
  }

  static createLink(name: string, url: ?string): LinkInfo {
    const link: LinkInfo = {
      tempId: stringHelper.randomAlphanumeric(),
      linkName: name,
      linkUrl: url || "",
      visibility: Visibility.PUBLIC,
    };
    return link;
  }

  onModalCancel(): void {
    this.setState({ showAddEditModal: false });
  }

  saveLink(linkData: LinkInfo): void {
    linkData.tempId = stringHelper.randomAlphanumeric();
    if (this.props.linkNamePrefix) {
      linkData.linkName = this.props.linkNamePrefix + linkData.linkName;
    }
    const newFormFieldValues: Dictionary<string> = _.fromPairs([
      [linkData.linkName, linkData.linkUrl],
    ]);
    const newLink: Dictionary<LinkInfo> = _.fromPairs([
      [linkData.linkName, linkData],
    ]);
    this.state.linkDict[linkData.linkName] = linkData;
    UniversalDispatcher.dispatch({
      type: "ADD_FORM_FIELDS",
      formFieldValues: newFormFieldValues,
      validators: this.generateLinkValidators(newLink),
    });

    this.setState({ showAddEditModal: false });
  }

  openNewLinkModal(): void {
    this.setState({ existingLink: null, showAddEditModal: true });
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

          {!_.isEmpty(this.props.addLinkText) && (
            <span
              className="add-link"
              onClick={this.openNewLinkModal.bind(this)}
            >
              <i
                className={Glyph(GlyphStyles.Add, GlyphSizes.SM)}
                aria-hidden="true"
              ></i>
              {this.props.addLinkText}
            </span>
          )}
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
            <TextFormField
              id={link.linkName}
              label={header}
              type={TextFormFieldType.SingleLine}
              required={false}
              maxLength={2075}
            />
          </div>
        );
      });
    }
  }
}

export default Container.create(LinkList, { withProps: true });
