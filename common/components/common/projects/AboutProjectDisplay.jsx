// @flow

import React from "react";
import _ from "lodash";
import ProjectAPIUtils, {
  ProjectDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import ProjectDetails from "../../componentsBySection/FindProjects/ProjectDetails.jsx";
import ContactProjectButton from "./ContactProjectButton.jsx";
import ContactVolunteersButton from "./ContactVolunteersButton.jsx";
import ProjectVolunteerButton from "./ProjectVolunteerButton.jsx";
import ProjectVolunteerModal from "./ProjectVolunteerModal.jsx";
import ProjectCommitCard from "./ProjectCommitCard.jsx";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../volunteers/VolunteerSection.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import InviteProjectToGroupButton from "./InviteProjectToGroupButton.jsx";
import ApproveGroupsSection from "./ApproveGroupsSection.jsx";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import EventCardsListings from "../../componentsBySection/FindEvents/EventCardsListings.jsx";
import type { MyGroupData } from "../../stores/MyGroupsStore.js";

type Props = {|
  project: ?ProjectDetailsAPIData,
  viewOnly: boolean,
|};

type State = {|
  project: ?ProjectDetailsAPIData,
  viewOnly: boolean,
  volunteers: ?$ReadOnlyArray<VolunteerDetailsAPIData>,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
  tabs: object,
  maxActivity: number,
|};

class AboutProjectDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      project: props.project,
      viewOnly: props.viewOnly || url.argument("embedded"),
      volunteers: props.project && props.project.project_volunteers,
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null,
      tabs: {
        details: true,
        skills: false,
        activity: false,
      },
      maxActivity: 5,
    };
    this.handleUpdateVolunteers = this.handleUpdateVolunteers.bind(this);
    this.handleShowMoreActivity = this.handleShowMoreActivity.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      project: nextProps.project,
      viewOnly: nextProps.viewOnly || url.argument("embedded"),
      volunteers: nextProps.project.project_volunteers,
    });
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position,
    });
  }

  handleUpdateVolunteers(volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>) {
    this.setState({
      volunteers: volunteers,
    });
  }

  handleShowMoreActivity() {
    this.setState({ maxActivity: this.state.maxActivity + 5 });
  }

  confirmJoinProject(confirmJoin: boolean) {
    if (confirmJoin) {
      window.location.reload(true);
    } else {
      this.setState({ showJoinModal: false });
    }
  }

  render(): $React$Node {
    return this.state.project ? (
      this._renderPageLayout()
    ) : (
      <div>{this.state.loadStatusMsg}</div>
    );
  }
  // TODO: Remove Headers component and get them from the backend, like we're doing on newer pages
  _renderPageLayout(): React$Node {
    const project = this.state.project;
    return (
      <div className="container Profile-root">
        {this._renderHeader(project)}
        <div className="row">
          <div className="Profile-top-section col-12">
            {this._renderTopSection(project)}
          </div>
        </div>
        <div className="row">
          <div className="Profile-primary-section col-12">
            {this._renderMainSection(project)}
          </div>

          <div className="Profile-secondary-section col-12">
            {this._renderSecondarySection(project)}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSection(project) {
    return (
      <React.Fragment>
        <h1>{project && project.project_name}</h1>
        <p>
          {project &&
            project.project_issue_area &&
            project.project_issue_area
              .map(issue => issue.display_name)
              .join(",")}
        </p>
        <p>{project && project.project_short_description}</p>
        <ApproveGroupsSection project={this.props.project} />

        <ProjectVolunteerModal
          projectId={this.state.project && this.state.project.project_id}
          positions={this.state.project && this.state.project.project_positions}
          positionToJoin={this.state.positionToJoin}
          showModal={this.state.showJoinModal}
          handleClose={this.confirmJoinProject.bind(this)}
        />

        {!this.state.viewOnly && this._renderContactAndVolunteerButtons()}
        <img
          className="OLD_AboutProjects-icon"
          src={
            project &&
            project.project_thumbnail &&
            project.project_thumbnail.publicUrl
          }
        />

        <ProjectDetails
          projectLocation={
            project && ProjectAPIUtils.getLocationDisplayName(project)
          }
          projectUrl={project && project.project_url}
          projectStage={
            project && !_.isEmpty(project.project_stage)
              ? project.project_stage[0].display_name
              : null
          }
          projectOrganizationType={
            project && !_.isEmpty(project.project_organization_type)
              ? project.project_organization_type[0].display_name
              : null
          }
          dateModified={project && project.project_date_modified}
        />
      </React.Fragment>
    );
  }

  //TODO: Conditional rendering of each section, tab controller to hide/show
  _renderMainSection(project) {
    return (
      <React.Fragment>
        <div className="Profile-tab-container">
          <div className="Profile-tab Profile-tab-details">
            {!_.isEmpty(
              project.project_description_solution ||
                project.project_description_actions
            ) && (
              <h3 className="OLD_AboutProjects-details-sectionheader">
                Problem
              </h3>
            )}
            {project.project_description}
            {!_.isEmpty(project.project_description_solution) && (
              <React.Fragment>
                <div>
                  <h3 className="OLD_AboutProjects-details-sectionheader pt-4">
                    Solution
                  </h3>
                  {project.project_description_solution}
                </div>
              </React.Fragment>
            )}
            {!_.isEmpty(project.project_description_actions) && (
              <React.Fragment>
                <div>
                  <h3 className="OLD_AboutProjects-details-sectionheader pt-4">
                    Action
                  </h3>
                  {project.project_description_actions}
                </div>
              </React.Fragment>
            )}
          </div>

          <div className="Profile-tab Profile-tab-skillsneeded">
            {project && !_.isEmpty(project.project_positions) && (
              <div className="OLD_AboutProjects-skills">
                <p
                  id="skills-needed"
                  className="OLD_AboutProjects-skills-title"
                >
                  Skills Needed
                </p>
                {project &&
                  project.project_positions &&
                  project.project_positions.map(position => (
                    <p>{position.roleTag.display_name}</p>
                  ))}
              </div>
            )}

            {project && !_.isEmpty(project.project_technologies) && (
              <div className="OLD_AboutProjects-technologies">
                <p className="OLD_AboutProjects-tech-title">
                  Technologies Used
                </p>
                {project &&
                  project.project_technologies &&
                  project.project_technologies.map(tech => (
                    <p>{tech.display_name}</p>
                  ))}
              </div>
            )}

            <div className="OLD_AboutProjects-positions-available">
                {project &&
                  !_.isEmpty(project.project_positions) &&
                  this._renderPositions()}
            </div>
          </div>

          <div className="Profile-tab Profile-tab-events">
              <div className="OLD_AboutProjects-events">
                <EventCardsListings
                  events={project.project_events}
                  showMessageForNoFutureEvents={false}
                />
              </div>
          </div>

          <div className="Profile-tab Profile-tab-recent-activity">
                <h4>Recent Activity</h4>
                {project.project_commits
                  .slice(0, this.state.maxActivity)
                  .map(commit => (
                    <ProjectCommitCard commit={commit} />
                  ))}
                {project.project_commits.length > this.state.maxActivity && (
                  <div className="OLD_AboutProjects-show-more-activity-container">
                    <div
                      className="btn btn-primary AboutProjects-show-more-activity"
                      onClick={this.handleShowMoreActivity}
                    >
                      Show more activity
                    </div>
                  </div>
                )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderSecondarySection(project) {
    return (
      <div className="Profile-secondary-section col-12">
        {project && !_.isEmpty(project.project_links) && (
          <React.Fragment>
            <div className="OLD_AboutProjects-links">
              <h4>Links</h4>
              {this._renderLinks()}
            </div>
          </React.Fragment>
        )}

        {project && !_.isEmpty(project.project_files) && (
          <React.Fragment>
            <div className="OLD_AboutProjects-files">
              <h4>Files</h4>
              {this._renderFiles()}
            </div>
          </React.Fragment>
        )}

        {this._renderGroups(project)}

        <div>
          {!_.isEmpty(this.state.volunteers) ? (
            <VolunteerSection
              volunteers={this.state.volunteers}
              isProjectAdmin={CurrentUser.userID() === project.project_creator}
              isProjectCoOwner={CurrentUser.isCoOwner(project)}
              projectId={project.project_id}
              renderOnlyPending={true}
              onUpdateVolunteers={this.handleUpdateVolunteers}
            />
          ) : null}
          <h4>Team</h4>
          {project && !_.isEmpty(project.project_owners) ? (
            <ProjectOwnersSection owners={project.project_owners} />
          ) : null}

          {!_.isEmpty(this.state.volunteers) ? (
            <VolunteerSection
              volunteers={this.state.volunteers}
              isProjectAdmin={CurrentUser.userID() === project.project_creator}
              isProjectCoOwner={CurrentUser.isCoOwner(project)}
              projectId={project.project_id}
              renderOnlyPending={false}
              onUpdateVolunteers={this.handleUpdateVolunteers}
            />
          ) : null}
        </div>
      </div>
    );
  }

  _renderHeader(project: ProjectDetailsAPIData): React$Node {
    const title: string = project.project_name + " | DemocracyLab";
    const description: string =
      project.project_short_description ||
      Truncate.stringT(project.project_description, 300);

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={
          project.project_thumbnail && project.project_thumbnail.publicUrl
        }
      />
    );
  }

  _renderContactAndVolunteerButtons(): React$Node {
    return (
      <div className="OLD_AboutProjects-owner">
        <ContactProjectButton project={this.state.project} />
        <ContactVolunteersButton project={this.state.project} />
        <InviteProjectToGroupButton project={this.state.project} />
        <ProjectVolunteerButton
          project={this.state.project}
          onVolunteerClick={this.handleShowVolunteerModal.bind(this)}
        />
      </div>
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const project = this.state.project;
    return (
      project &&
      project.project_files &&
      project.project_files.map((file, i) => (
        <div key={i} className="OLD_AboutProjects-file-link">
          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
            {file.fileName}
          </a>
        </div>
      ))
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const project = this.state.project;
    const linkOrder = [
      LinkTypes.CODE_REPOSITORY,
      LinkTypes.FILE_REPOSITORY,
      LinkTypes.MESSAGING,
      LinkTypes.PROJECT_MANAGEMENT,
    ];
    const sortedLinks =
      project &&
      project.project_links &&
      Sort.byNamedEntries(
        project.project_links,
        linkOrder,
        link => link.linkName
      );
    return sortedLinks.map((link, i) => (
      <IconLinkDisplay key={i} link={link} />
    ));
  }

  _renderPositions(): ?Array<React$Node> {
    const project: ProjectDetailsAPIData = this.state.project;
    const canApply: boolean =
      !this.state.viewOnly && CurrentUser.canVolunteerForProject(project);
    return (
      project &&
      project.project_positions &&
      _.chain(project.project_positions)
        .sortBy(["roleTag.subcategory", "roleTag.display_name"])
        .value()
        .map((position, i) => {
          return (
            <AboutPositionEntry
              key={i}
              project={project}
              position={position}
              onClickApply={
                canApply
                  ? this.handleShowVolunteerModal.bind(this, position)
                  : null
              }
            />
          );
        })
    );
  }

  _renderGroups(project: ?ProjectDetailsAPIData): ?Array<React$Node> {
    const groups: ?$ReadOnlyArray<MyGroupData> =
      project &&
      project.project_groups &&
      project.project_groups.filter(
        group => group.isApproved && group.relationship_is_approved
      );
    return (
      !_.isEmpty(groups) && (
        <React.Fragment>
          <div className="OLD_AboutProjects-groups">
            <h4>Groups</h4>
            <ul>
              {project.project_groups.map((group, i) => {
                return (
                  <li key={i}>
                    {this._renderGroupIcon(group)}{" "}
                    <a
                      href={url.section(Section.AboutGroup, {
                        id: group.group_id,
                      })}
                    >
                      {group.group_name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </React.Fragment>
      )
    );
  }

  _renderGroupIcon(group): ?Array<React$Node> {
    return (
      <div className="OLD_AboutProjects-group-image">
        <a href={url.section(Section.AboutGroup, { id: group.group_id })}>
          {!_.isEmpty(group.group_thumbnail) ? (
            <img
              src={group.group_thumbnail.publicUrl}
              alt={group.group_name + " Logo"}
            />
          ) : (
            <i className={Glyph(GlyphStyles.Users, GlyphSizes.X3)}></i>
          )}
        </a>
      </div>
    );
  }
}

export default AboutProjectDisplay;
