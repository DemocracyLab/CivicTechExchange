// @flow

import React from "react";
import type { FluxReduceStore } from "flux/utils";
import _ from "lodash";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import GroupDetails from "./GroupDetails.jsx";
import ContactGroupButton from "./ContactGroupButton.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
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
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import { Container } from "flux/utils";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
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
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    const issueAreas: ?$ReadOnlyArray<TagDefinition> = this.getIssueAreas();
    return Object.assign(prevState || {}, {
      issueAreas: issueAreas,
    });
  }

  static getIssueAreas(): ?$ReadOnlyArray<TagDefinition> {
    const tags: Dictionary<TagDefinitionCount> = ProjectSearchStore.getAllTags();
    const presentTags: $ReadOnlyArray<TagDefinitionCount> = _.values(
      tags
    ).filter(
      (tag: TagDefinitionCount) =>
        tag.num_times > 0 && tag.category === TagCategory.ISSUES
    );
    return _.reverse(_.sortBy(presentTags, "num_times"));
  }

  render(): $React$Node {
    return this.state.group ? (
      this._renderDetails()
    ) : (
      <div>{this.state.loadStatusMsg}</div>
    );
  }

  _renderDetails(): React$Node {
    const group = this.state.group;
    return (
      <div className="AboutProjects-root">
        {this._renderHeader(group)}
        <div className="AboutProjects-infoColumn">
          <div className="AboutProjects-iconContainer">
            <img
              className="AboutProjects-icon"
              src={
                group &&
                group.group_thumbnail &&
                group.group_thumbnail.publicUrl
              }
            />
          </div>

          <div className="AboutProjects-details">
            <GroupDetails
              groupUrl={group && group.group_url}
              groupLocation={
                group && GroupAPIUtils.getLocationDisplayName(group)
              }
              projectCount={
                this.state.approvedProjects &&
                this.state.approvedProjects.length
              }
            />
          </div>

          {group && !_.isEmpty(group.group_links) && (
            <React.Fragment>
              <div className="AboutProjects-links">
                <h4>Links</h4>
                {this._renderLinks()}
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="AboutProjects-mainColumn">
          <div className="AboutProjects-intro">
            <div className="AboutProjects-introTop">
              <div className="AboutProjects-description">
                <h1>{group && group.group_name}</h1>
                <p>{group && group.group_short_description}</p>
              </div>

              {!this.props.viewOnly && this._renderContactAndVolunteerButtons()}
            </div>
          </div>

          <div className="AboutGroupDisplay-details">
            <div id="group-details">{group.group_description}</div>

            <div className="AboutProjects-skills-container">
              {!_.isEmpty(this.state.issueAreas) && (
                <div className="AboutProjects-skills">
                  <p id="skills-needed" className="AboutProjects-skills-title">
                    Issue Areas
                  </p>
                  {this.state.issueAreas &&
                    this.state.issueAreas.map((issue: TagDefinition) => (
                      <p>{issue.display_name}</p>
                    ))}
                </div>
              )}
            </div>
            <div className="AboutGroup-card-container">
              <ProfileProjectSearch viewOnly={this.props.viewOnly} wide />
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderHeader(group: GroupDetailsAPIData): React$Node {
    const title: string = group.group_name + " | DemocracyLab";
    const description: string =
      group.group_short_description ||
      Truncate.stringT(group.group_description, 300);

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={group.group_thumbnail && group.group_thumbnail.publicUrl}
      />
    );
  }

  _renderContactAndVolunteerButtons(): React$Node {
    return (
      <div className="AboutProjects-owner">
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
      ProjectSearchDispatcher.dispatch({
        type: "INIT",
        findProjectsArgs: {
          group_id: group.group_id,
        },
        searchSettings: {
          updateUrl: false,
        },
      });
    }
  }
}

export default Container.create(AboutGroupDisplay, { pure: false });
