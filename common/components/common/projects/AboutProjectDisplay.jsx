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
import ProjectCommitCard from "./RecentActivityCard/ProjectCommitCard.jsx";
import TrelloActionCard from "./RecentActivityCard/TrelloActionCard.jsx";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../volunteers/VolunteerSection.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import CurrentUser, { MyGroupData } from "../../utils/CurrentUser.js";
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
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import AllowMarkdown from "../richtext/AllowMarkdown.jsx";
import { isWithinIframe } from "../../utils/iframe.js";

type Props = {|
  project: ?ProjectDetailsAPIData,
  viewOnly: boolean,
|};

type State = {|
  project: ?ProjectDetailsAPIData,
  viewOnly: boolean,
  volunteers: ?$ReadOnlyArray<VolunteerDetailsAPIData>,
  visiblePositions: ?$ReadOnlyArray<PositionInfo>,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
  maxActivity: number,
|};

class AboutProjectDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      project: props.project,
      viewOnly: props.viewOnly,
      volunteers: props.project && props.project.project_volunteers,
      visiblePositions: props?.project?.project_positions.filter(
        (position: PositionInfo) => !position.isHidden
      ),
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null,
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
      visiblePositions: nextProps?.project?.project_positions.filter(
        (position: PositionInfo) => !position.isHidden
      ),
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
  // TODO: See if there's a more elegant way to construct this than passing the project prop repeatedly

  render(): React$Node {
    const project = this.state.project;
    const widthModifier=isWithinIframe() ? ' use-parent-width' : '';
    return (
      <div className={"container Profile-root" + widthModifier }>
        {this._renderHeader(project)}
        <div className="row">
          <div className="Profile-top-section col-12">
            {this._renderTopSection(project)}
          </div>
        </div>
        <div className="row flex-lg-nowrap">
          <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
            {this._renderPrimarySection(project)}
          </div>

          <div className="Profile-secondary-section col-12 col-lg-auto">
            {this._renderSecondarySection(project)}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSection(project) {
    return (
      <div className="Profile-top-section-content">
        <div className="Profile-top-logo">
          <img
            src={
              project &&
              project.project_thumbnail &&
              project.project_thumbnail.publicUrl
            }
          />
        </div>
        <div className="Profile-top-details">
          <h1>{project && project.project_name}</h1>
          <h3>
            {project &&
              project.project_issue_area &&
              project.project_issue_area
                .map(issue => issue.display_name)
                .join(",")}
          </h3>
          <p>{project && project.project_short_description}</p>
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
        </div>

        <div className="Profile-top-interactions">
          <ApproveGroupsSection project={this.props.project} />

          <ProjectVolunteerModal
            projectId={this.state.project && this.state.project.project_id}
            positions={this.state.visiblePositions}
            positionToJoin={this.state.positionToJoin}
            showModal={this.state.showJoinModal}
            handleClose={this.confirmJoinProject.bind(this)}
          />

          {!this.state.viewOnly && this._renderContactAndVolunteerButtons()}
        </div>
      </div>
    );
  }

  // tabbed primary section content
  _renderPrimarySection(project) {
    const widthModifier=isWithinIframe() ? ' override-breakpoint-width' : '';
    return (
      <div className={"Profile-primary-container" + widthModifier } >
        <Tabs defaultActiveKey="proj-details" id="AboutProject-tabs">
          <Tab
            eventKey="proj-details"
            title="Project Details"
            className="Profile-tab AboutProject-tab-details"
          >
            {!_.isEmpty(
              project.project_description_solution ||
                project.project_description_actions
            ) && <h3>Problem</h3>}
            <AllowMarkdown>{project.project_description}</AllowMarkdown>
            {!_.isEmpty(project.project_description_solution) && (
              <React.Fragment>
                <div>
                  <h3 className="pt-4">Solution</h3>
                  <AllowMarkdown>
                    {project.project_description_solution}
                  </AllowMarkdown>
                </div>
              </React.Fragment>
            )}
            {!_.isEmpty(project.project_description_actions) && (
              <React.Fragment>
                <div>
                  <h3 className="pt-4">Action</h3>
                  <AllowMarkdown>
                    {project.project_description_actions}
                  </AllowMarkdown>
                </div>
              </React.Fragment>
            )}

            <div className="AboutProject-skilltech-container pt-4">
              {project && !_.isEmpty(this.state.visiblePositions) && (
                <div className="AboutProject-skills">
                  <h4>Roles Needed</h4>
                  {this.state.visiblePositions.map(position => (
                    <span
                      className="Profile-pill"
                      key={position.roleTag.tag_name}
                    >
                      {position.roleTag.display_name}
                    </span>
                  ))}
                </div>
              )}

              {project && !_.isEmpty(project.project_technologies) && (
                <div className="AboutProject-technologies">
                  <h4>Technologies Used</h4>
                  {project.project_technologies.map(tech => (
                    <span className="Profile-pill" key={tech.tag_name}>
                      {tech.display_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {project && !_.isEmpty(this.state.visiblePositions) && (
              <div className="AboutProject-positions-available pt-4">
                <h3>Positions Available</h3>
                {this._renderPositions()}
              </div>
            )}
          </Tab>

          {project.project_events && !_.isEmpty(project.project_events) && (
            <Tab
              eventKey="proj-events"
              title="Events"
              className="Profile-tab AboutProject-tab-events"
            >
              <div>
                <EventCardsListings
                  events={project.project_events}
                  showMessageForNoFutureEvents={false}
                />
              </div>
            </Tab>
          )}

          {project.project_actions && !_.isEmpty(project.project_actions) && (
            <Tab
              eventKey="proj-activity"
              title="Recent Activity"
              className="Profile-tab AboutProject-tab-recent-activity"
            >
              <h3>Recent Activity</h3>
              {project.project_actions
                .slice(0, this.state.maxActivity)
                .map(action => {
                  if (action.type === "ProjectCommit") {
                    return <ProjectCommitCard commit={action} />;
                  } else if (action.type === "TrelloAction") {
                    return <TrelloActionCard action={action} />;
                  } else {
                    // unknown action type
                  }
                })}
              {project.project_actions.length > this.state.maxActivity && (
                <div className="AboutProject-show-more-activity-container">
                  <Button
                    variant="primary"
                    onClick={this.handleShowMoreActivity}
                  >
                    Show more activity
                  </Button>
                </div>
              )}
            </Tab>
          )}
        </Tabs>
      </div>
    );
  }

  _renderSecondarySection(project) {
    return (
      <div className="Profile-secondary-container">
        {project && !_.isEmpty(project.project_links) && (
          <React.Fragment>
            <div className="Profile-links AboutProject-secondary-section">
              <h4>Links</h4>
              {this._renderLinks()}
            </div>
          </React.Fragment>
        )}

        {project && !_.isEmpty(project.project_files) && (
          <React.Fragment>
            <div className="AboutProject-files AboutProject-secondary-section">
              <h4>Files</h4>
              {this._renderFiles()}
            </div>
          </React.Fragment>
        )}

        {this._renderGroups(project)}

        <div className="AboutProject-staff AboutProject-secondary-section">
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
      <div className="Profile-owner">
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
        <div key={i} className="AboutProject-file-link">
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
      !this.state.viewOnly && CurrentUser.canVolunteerFor(project);
    return (
      !_.isEmpty(this.state.visiblePositions) &&
      _.chain(this.state.visiblePositions)
        .sortBy(["orderNumber", "id"])
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
          <div className="AboutProject-group AboutProject-secondary-section">
            <h4>Groups</h4>
            <ul>
              {project.project_groups.map((group, i) => {
                return (
                  <li key={i}>
                    {this._renderGroupIcon(group)}{" "}
                    <a
                      href={url.section(Section.AboutGroup, {
                        id: group.slug || group.group_id,
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
      <div className="AboutProject-group-image">
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
