// @flow

import React from "react";
import type { FluxReduceStore } from "flux/utils";
import _ from "lodash";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import GroupDetails from "./GroupDetails.jsx";
import ContactGroupButton from "./ContactGroupButton.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import GroupAPIUtils, {
  ProjectRelationshipAPIData,
} from "../../utils/GroupAPIUtils.js";
import type {
  TagDefinition,
  TagDefinitionCount,
} from "../../utils/ProjectAPIUtils.js";
import ProfileProjectSearch from "../projects/ProfileProjectSearch.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Container } from "flux/utils";
import EntitySearchStore, {
  SearchFor,
} from "../../stores/EntitySearchStore.js";
import { Dictionary } from "../../types/Generics.jsx";
import TagCategory from "../tags/TagCategory.jsx";

type Props = {|
  group: ?GroupDetailsAPIData,
  viewOnly: boolean,
|};

type State = {|
  group: ?GroupDetailsAPIData,
  approvedProjects: $ReadOnlyArray<ProjectRelationshipAPIData>,
  issueAreas: $ReadOnlyArray<TagDefinition>,
  showJoinModal: boolean,
|};

class AboutGroupDisplay extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = { group: props.group };
    this.initProjectSearch(this.state);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const issueAreas: ?$ReadOnlyArray<TagDefinition> = this.getIssueAreas();
    return Object.assign(prevState || {}, {
      issueAreas: issueAreas,
    });
  }

  static getIssueAreas(): ?$ReadOnlyArray<TagDefinition> {
    const tags: Dictionary<TagDefinitionCount> = EntitySearchStore.getAllTags();
    const presentTags: $ReadOnlyArray<TagDefinitionCount> = _.values(
      tags
    ).filter(
      (tag: TagDefinitionCount) =>
        tag.num_times > 0 && tag.category === TagCategory.ISSUES
    );
    return _.reverse(_.sortBy(presentTags, "num_times"));
  }

  render(): React$Node {
    const group: GroupDetailsAPIData = this.state.group;
    return (
      <div className="container Profile-root">
        <div className="row">
          <div className="Profile-top-section col-12">
            {this._renderTopSection(group)}
          </div>
        </div>
        <div className="row flex-lg-nowrap">
          <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
            {this._renderPrimarySection(group)}
          </div>

          <div className="Profile-secondary-section col-12 col-lg-auto">
            {this._renderSecondarySection(group)}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSection(group): React$Node {
    return (
      <div className="Profile-top-section-content">
        <div className="Profile-top-logo">
          <img
            src={
              group && group.group_thumbnail && group.group_thumbnail.publicUrl
            }
          />
        </div>
        <div className="Profile-top-details">
          <h1>{group && group.group_name}</h1>
          <p>{group && group.group_short_description}</p>

          <GroupDetails
            groupUrl={group && group.group_url}
            groupLocation={group && GroupAPIUtils.getLocationDisplayName(group)}
            projectCount={
              this.state.approvedProjects && this.state.approvedProjects.length
            }
          />
        </div>
        <div className="Profile-top-interactions">
          {!this.props.viewOnly && this._renderContactAndVolunteerButtons()}
        </div>
      </div>
    );
  }

  //reusing some of the Profile tab classes for styling; but not <Tabs> themselves
  _renderPrimarySection(group): React$Node {
    return (
      <div className="Profile-primary-container">
        <div className="Profile-tab tab-content">
          <h3>Group Description</h3>
          <div className="AboutGroup-description">
            {group.group_description}
          </div>
          <div className="AboutGroup-issue-areas pt-4">
            {!_.isEmpty(this.state.issueAreas) && (
              <React.Fragment>
                <h4>Issue Areas</h4>
                {this.state.issueAreas &&
                  this.state.issueAreas.map((issue: TagDefinition) => (
                    <span className="Profile-pill" key={issue.tag_name}>
                      {issue.display_name}
                    </span>
                  ))}
              </React.Fragment>
            )}
          </div>
          {group.group_project_count > 0 && (
            <div className="AboutGroup-card-container pt-4">
              <ProfileProjectSearch viewOnly={this.props.viewOnly} wide />
            </div>
          )}
        </div>
      </div>
    );
  }

  _renderSecondarySection(group): React$Node {
    return (
      <div className="Profile-secondary-container">
        {group && !_.isEmpty(group.group_links) && (
          <React.Fragment>
            <div className="Profile-links AboutGroup-secondary-section">
              <h4>Links</h4>
              {this._renderLinks()}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  _renderContactAndVolunteerButtons(): React$Node {
    return (
      <div className="Profile-owner">
        <ContactGroupButton group={this.state.group} />
      </div>
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const group = this.state.group;
    const linkOrder = [
      LinkTypes.CODE_REPOSITORY,
      LinkTypes.FILE_REPOSITORY,
      LinkTypes.MESSAGING,
      LinkTypes.GROUP_MANAGEMENT,
    ];
    const sortedLinks =
      group &&
      group.group_links &&
      Sort.byNamedEntries(group.group_links, linkOrder, link => link.linkName);
    return sortedLinks.map((link, i) => (
      <IconLinkDisplay key={i} link={link} />
    ));
  }

  initProjectSearch(state: State) {
    const group: GroupDetailsAPIData = state.group;
    if (group) {
      UniversalDispatcher.dispatch({
        type: "INIT_SEARCH",
        findProjectsArgs: {
          group_id: group.group_id,
          sortField: "-project_date_modified",
        },
        searchSettings: {
          updateUrl: false,
          searchConfig: SearchFor.Projects,
        },
      });
    }
  }
}

export default Container.create(AboutGroupDisplay, { pure: false });
