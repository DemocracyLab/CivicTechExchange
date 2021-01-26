// @flow

import React from "react";
import _ from "lodash";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import GroupDetails from "./GroupDetails.jsx";
import ContactGroupButton from "./ContactGroupButton.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import GroupAPIUtils from "../../utils/GroupAPIUtils.js";
import ProjectCard from "../../componentsBySection/FindProjects/ProjectCard.jsx";
import ProjectAPIUtils, { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import type { ProjectAPIData } from "../../utils/ProjectAPIUtils";
import type { ProjectRelationshipAPIData } from "../../utils/GroupAPIUtils";
import ProfileProjectSearch from "../projects/ProfileProjectSearch.jsx";
import { EventData } from "../../utils/EventAPIUtils";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";

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

class AboutGroupDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = this.loadGroupIntoState(props.group);
    this.initProjectSearch(this.state);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(
      this.loadGroupIntoState(nextProps.group),
      this.initProjectSearch
    );
  }

  loadGroupIntoState(group: GroupDetailsAPIData): State {
    const approvedProjects: $ReadOnlyArray<ProjectRelationshipAPIData> = !_.isEmpty(
      group.group_projects
    )
      ? group.group_projects.filter(
          (pr: ProjectRelationshipAPIData) => pr.relationship_is_approved
        )
      : [];
    return {
      group: group,
      approvedProjects: _.reverse(
        _.sortBy(
          approvedProjects,
          (p: ProjectRelationshipAPIData) => p.project_date_modified
        )
      ),
      issueAreas: this.getUniqueIssueAreas(approvedProjects),
    };
  }

  getUniqueIssueAreas(
    projects: $ReadOnlyArray<ProjectRelationshipAPIData>
  ): ?$ReadOnlyArray<TagDefinition> {
    let issues = projects.map(
      (proj: ProjectRelationshipAPIData) =>
        proj.project_issue_area && proj.project_issue_area[0]
    );
    issues = issues.filter(
      (issue: TagDefinition) => issue && issue.tag_name !== "no-specific-issue"
    );
    return _.uniqBy(issues, (issue: TagDefinition) => issue.tag_name);
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

            <div className="AboutProjects_tabs"></div>
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
              <ProfileProjectSearch viewOnly={this.props.viewOnly} />
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

export default AboutGroupDisplay;
