// @flow

import React from "react";
import _ from "lodash";
import type Moment from "moment";
import Button from "react-bootstrap/Button";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import datetime from "../../utils/datetime.js";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import urlHelper from "../../utils/url.js";
import CurrentUser, {
  MyRSVPData,
  UserContext,
} from "../../utils/CurrentUser.js";
import PlaySVG from "../../svg/play-button.svg";
import VideoModal from "../video/VideoModal.jsx";
import type { LinkInfo } from "../../forms/LinkInfo.jsx";
import EventProjectRSVPModal from "./EventProjectRSVPModal.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import EventProjectAPIUtils, {
  VolunteerRSVPDetailsAPIData,
} from "../../utils/EventProjectAPIUtils.js";
import RSVPVolunteerCard from "./RSVPVolunteerCard.jsx";
import Toast from "../notification/Toast.jsx";
import ConfirmationModal from "../confirmation/ConfirmationModal.jsx";
import ProjectAPIUtils, { APIResponse } from "../../utils/ProjectAPIUtils.js";
import promiseHelper from "../../utils/promise.js";
import JoinConferenceButton from "./JoinConferenceButton.jsx";
import AllowMarkdown from "../richtext/AllowMarkdown.jsx";
import ContactEventVolunteersButton from "./ContactEventVolunteersButton.jsx";

type Props = {|
  eventProject: ?EventProjectAPIDetails,
  viewOnly: boolean,
|};

type State = {|
  eventProject: ?EventProjectAPIDetails,
  viewOnly: boolean,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showRSVPedToast: boolean,
  showCancelRSVPModal: boolean,
  showPostCancelRSVPToast: boolean,
  shownPosition: ?PositionInfo,
  showVideoModal: boolean,
  videoLink: ?LinkInfo,
  isRSVPedForThisEventProject: boolean,
  isProjectOwner: boolean,
  isPastEvent: boolean,
|};

class AboutProjectEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    const userContext: UserContext = CurrentUser?.userContext();
    const rsvp_events: Dictionary<MyRSVPData> = userContext?.rsvp_events || {};
    const isProjectOwner: boolean = CurrentUser.isCoOwnerOrOwner(
      props.eventProject
    );
    const endDate: Moment = datetime.parse(props.eventProject.event_date_end);
    const isRSVPedForThisEventProject: boolean = _.some(
      rsvp_events,
      (rsvp: MyRSVPData) =>
        rsvp.event_id === props.eventProject.event_id &&
        rsvp.project_id === props.eventProject.project_id
    );
    const videoLink: ?LinkInfo =
      !_.isEmpty(props.eventProject?.event_project_links) &&
      props.eventProject?.event_project_links.find(
        (link: LinkInfo) => link.linkName === LinkTypes.VIDEO
      );
    const showJoinModal =
      window.location.href.includes("signUp") && !isRSVPedForThisEventProject;
    this.state = {
      eventProject: props.eventProject,
      viewOnly: props.viewOnly,
      showContactModal: false,
      showRSVPedToast: false,
      showCancelRSVPModal: false,
      showPostCancelRSVPToast: false,
      showJoinModal: showJoinModal,
      shownPosition: null,
      videoLink: videoLink,
      isRSVPedForThisEventProject: isRSVPedForThisEventProject,
      isProjectOwner: isProjectOwner,
      isPastEvent: endDate < datetime.now(),
    };
    this.cancelRSVP = this.cancelRSVP.bind(this, props.eventProject);
    this.handleShowVolunteerModal = this.handleShowVolunteerModal.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return {
      eventProject: nextProps.eventProject,
      viewOnly: nextProps.viewOnly || url.argument("embedded"),
    };
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position,
    });
  }

  confirmJoinProject(
    confirmJoin: boolean,
    eventProject: EventProjectAPIDetails
  ) {
    let state: State = { showJoinModal: false };
    if (confirmJoin) {
      state.eventProject = eventProject;
      state.showRSVPedToast = true;
      state.isRSVPedForThisEventProject = true;
    }
    this.setState(state);
  }

  render(): React$Node {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    return (
      <div className="container Profile-root">
        <div className="row">
          <div className="AboutProjectEvent-top-section  col-12">
            {this._renderTopSection(eventProject)}
          </div>
        </div>
        <div className="row flex-lg-nowrap">
          <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
            {this._renderPrimarySection(eventProject)}
          </div>

          <div className="Profile-secondary-section col-12 col-lg-auto">
            {this._renderSecondarySection(eventProject)}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSection(eventProject: EventProjectAPIDetails): React$Node {
    const showVideo: boolean = !_.isEmpty(this.state.videoLink);
    const showEdit: boolean =
      CurrentUser.isCoOwnerOrOwner(eventProject) || CurrentUser.isStaff();
    const editUrl: string =
      urlHelper.section(Section.CreateEventProject, {
        event_id: eventProject.event_id,
        project_id: eventProject.project_id,
      });

    return (
      <div className="AboutProjectEvent-top-content">
        <div className="AboutProjectEvent-event-logo d-lg-none">
          {eventProject?.event_thumbnail?.publicUrl ? (
            <a
              href={url.section(Section.AboutEvent, {
                id: eventProject.event_id,
              })}
            >
              <img
                src={eventProject.event_thumbnail.publicUrl}
                alt="Event Logo"
              ></img>
            </a>
          ) : null}
        </div>
        <div className="AboutProjectEvent-top-names">
          <div className="AboutProjectEvent-top-names-text">
            <h1>{eventProject && eventProject.project_name}</h1>
            <h3>{eventProject && eventProject.event_name}</h3>
          </div>
          <div className="AboutProjectEvent-event-logo-desktop d-none d-lg-flex">
            <div className="ProjectCard-logo">
              {eventProject?.event_thumbnail?.publicUrl ? (
                <a
                  href={url.section(Section.AboutEvent, {
                    id: eventProject.event_id,
                  })}
                >
                  <img
                    src={eventProject.event_thumbnail.publicUrl}
                    alt="Event Logo"
                  ></img>
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="Profile-top-section-content">
          {showVideo && (
            <VideoModal
              showModal={this.state.showVideoModal}
              onClose={() => {
                this.setState({ showVideoModal: false });
              }}
              videoUrl={this.state.videoLink.linkUrl}
              videoTitle={eventProject.project_name}
            />
          )}
          <div
            className="Profile-top-logo"
            onClick={() => {
              showVideo && this.setState({ showVideoModal: true });
            }}
          >
            {eventProject?.project_thumbnail?.publicUrl ? (
              <div>
                {showVideo && (
                  <div className="ProjectCard-play-button">
                    <PlaySVG />
                  </div>
                )}
                <img
                  src={eventProject.project_thumbnail.publicUrl}
                  alt="Project Logo"
                />
              </div>
            ) : null}
          </div>
          <div className="Profile-top-details">{this._renderIconList()}</div>
          <div className="Profile-top-interactions">
            {showEdit && (
              <Button variant="primary" href={editUrl}>
                Edit
              </Button>
            )}
            {!this.state.isPastEvent && this._renderJoinButton(eventProject)}
            {this._renderLeaveButton(eventProject)}
            {!this.state.isPastEvent &&
              this._renderCancelRSVPButton(eventProject)}
            {this.state.isProjectOwner &&
              !_.isEmpty(this.props.eventProject.event_project_volunteers) && (
                <ContactEventVolunteersButton
                  eventProject={this.props.eventProject}
                />
              )}
          </div>
        </div>
      </div>
    );
  }

  _renderJoinButton(eventProject: EventProjectAPIDetails): React$Node {
    let buttonConfig: Dictionary<any> = {};
    let label: string = eventProject.is_activated
      ? "Join Event Video"
      : "Sign up";
    if (CurrentUser.isLoggedIn()) {
      if (
        !this.state.isProjectOwner &&
        !this.state.isRSVPedForThisEventProject
      ) {
        buttonConfig = {
          onClick: () => {
            this.setState({ showJoinModal: true });
          },
        };
      } else if (eventProject.is_activated) {
        buttonConfig = {
          href:
            eventProject.event_conference_admin_url ||
            eventProject.event_conference_url,
          target: "_blank",
        };
      }
    } else {
      // If not logged in, go to login page
      buttonConfig = { href: urlHelper.logInThenReturn() };
    }

    return (
      <React.Fragment>
        <Toast
          header=""
          show={this.state.showRSVPedToast}
          onClose={() => this.setState({ showRSVPedToast: false })}
        >
          <p>
            You have joined the team. Thanks for signing up for the hackathon!
          </p>
        </Toast>

        <EventProjectRSVPModal
          eventProject={eventProject}
          positionToJoin={this.state.positionToJoin}
          showModal={this.state.showJoinModal}
          handleClose={this.confirmJoinProject.bind(this)}
          conferenceUrl={
            this.props.eventProject.event_conference_admin_url ||
            this.props.eventProject.event_conference_url
          }
        />

        {!_.isEmpty(buttonConfig) &&
          (eventProject.is_activated ? (
            <JoinConferenceButton
              buttonConfig={buttonConfig}
              participant_count={eventProject.event_conference_participants}
              className="JoinConference-livebutton"
            >
              {label}
            </JoinConferenceButton>
          ) : (
            <Button
              variant="primary"
              type="button"
              className="JoinConference-livebutton"
              {...buttonConfig}
            >
              {label}
            </Button>
          ))}
      </React.Fragment>
    );
  }

  cancelRSVP(
    eventProject: EventProjectAPIDetails,
    confirm: boolean
  ): Promise<any> {
    if (confirm) {
      const confirmCancel = (response: APIResponse) => {
        // TODO: Show toast on Event page saying that event project was canceled
        window.location.href = url.section(Section.AboutEvent, {
          id: eventProject.event_slug || eventProject.event_id,
        });
      };
      return EventProjectAPIUtils.cancelEventProject(
        eventProject.event_id,
        eventProject.project_id,
        confirmCancel
      );
    } else {
      return promiseHelper.promisify(() =>
        this.setState({
          showCancelRSVPModal: false,
        })
      );
    }
  }

  _renderLeaveButton(eventProject: EventProjectAPIDetails): React$Node {
    return (
      <React.Fragment>
        <Toast
          header="You Have Left This Hackathon Project"
          show={this.state.showPostCancelRSVPToast}
          onClose={() => this.setState({ showPostCancelRSVPToast: false })}
          timeoutMilliseconds={6000}
        >
          <p>
            You may sign up for a different project, or join a project on the
            day of the hackathon.
          </p>
        </Toast>

        {this.state.isRSVPedForThisEventProject && (
          <React.Fragment>
            <ConfirmationModal
              showModal={this.state.showCancelRSVPModal}
              message="You will be removed from this hackathon project.  Do you want to continue?"
              headerText="Leave this Hackathon Project?"
              onSelection={this.cancelRSVP}
              reverseCancelConfirm={true}
            />

            <Button
              variant="primary"
              type="button"
              onClick={() => this.setState({ showCancelRSVPModal: true })}
            >
              Leave Project
            </Button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  _renderCancelRSVPButton(eventProject: EventProjectAPIDetails): React$Node {
    return (
      this.state.isProjectOwner && (
        <React.Fragment>
          <ConfirmationModal
            showModal={this.state.showCancelRSVPModal}
            message="If you cancel your RSVP, you will be removed from the hackathon.  Do you want to continue?"
            headerText="Cancel Your RSVP?"
            onSelection={this.cancelRSVP}
            reverseCancelConfirm={true}
          />

          <Button
            variant="primary"
            className="AboutEvent-rsvp-btn"
            type="button"
            onClick={() => this.setState({ showCancelRSVPModal: true })}
          >
            Cancel RSVP
          </Button>
        </React.Fragment>
      )
    );
  }

  // primary section content
  _renderPrimarySection(eventProject: EventProjectAPIDetails): React$Node {
    const comingSoonMsg: React$Node = <p>Coming soon!</p>;

    return (
      <div className="Profile-primary-container">
        <div className="tab-content AboutProjectEvent-primary-container">
          <h3>About</h3>
          <p>{eventProject?.project_short_description}</p>

          <h3>Problem</h3>
          <AllowMarkdown>{eventProject?.project_description}</AllowMarkdown>

          {eventProject?.project_description_solution && (
            <React.Fragment>
              <h3>Solution</h3>
              <AllowMarkdown>
                {eventProject.project_description_solution}
              </AllowMarkdown>
            </React.Fragment>
          )}

          <h3>Hackathon Goal</h3>
          {eventProject?.event_project_goal ? (
            <AllowMarkdown>{eventProject.event_project_goal}</AllowMarkdown>
          ) : (
            comingSoonMsg
          )}

          <h3>Planned Scope</h3>
          {eventProject?.event_project_scope ? (
            <AllowMarkdown>{eventProject.event_project_scope}</AllowMarkdown>
          ) : (
            comingSoonMsg
          )}

          {/*TODO: Show newlines*/}
          <h3>Schedule</h3>
          {eventProject?.event_project_agenda ? (
            <AllowMarkdown>{eventProject.event_project_agenda}</AllowMarkdown>
          ) : (
            comingSoonMsg
          )}

          <h3>Additional Notes</h3>
          {eventProject?.event_project_onboarding_notes ? (
            <AllowMarkdown>
              {eventProject.event_project_onboarding_notes}
            </AllowMarkdown>
          ) : (
            comingSoonMsg
          )}
          {eventProject && !_.isEmpty(eventProject.project_technologies) && (
            <div className="AboutProject-technologies">
              <h3>Technologies Used</h3>
              {eventProject.project_technologies.map(tech => (
                <span className="Profile-pill" key={tech.tag_name}>
                  {tech.display_name}
                </span>
              ))}
            </div>
          )}

          {eventProject && !_.isEmpty(eventProject.event_project_positions) && (
            <div className="AboutProject-positions-available pt-4">
              <h3>Roles Needed</h3>
              {this._renderPositions()}
            </div>
          )}
        </div>
      </div>
    );
  }

  _renderSecondarySection(eventProject: EventProjectAPIDetails) {
    return (
      <div className="Profile-secondary-container">
        {eventProject && !_.isEmpty(eventProject.event_project_links) && (
          <React.Fragment>
            <div className="Profile-links AboutProject-secondary-section">
              <h4>Links</h4>
              {this._renderLinks()}
            </div>
          </React.Fragment>
        )}
        {eventProject && !_.isEmpty(eventProject.event_project_files) && (
          <React.Fragment>
            <div className="AboutProject-files AboutProject-secondary-section">
              <h4>Files</h4>
              {this._renderFiles()}
            </div>
          </React.Fragment>
        )}
        {eventProject && !_.isEmpty(eventProject.project_owners) && (
          <React.Fragment>
            <div className="AboutProject-staff AboutProject-secondary-section">
              {this._renderTeam()}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  // TODO: Remove if we're not using files
  _renderFiles(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    return (
      eventProject &&
      eventProject.event_project_files &&
      eventProject.event_project_files.map((file, i) => (
        <div key={i} className="AboutProject-file-link">
          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
            {file.fileName}
          </a>
        </div>
      ))
    );
  }

  _renderTeam(): React$Node {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    const numVolunteers = eventProject?.event_project_volunteers?.length || 0;
    const groupedVolunteers = _.groupBy(
      eventProject.event_project_volunteers,
      (rsvp: VolunteerRSVPDetailsAPIData) => {
        return rsvp.roleTag[0].subcategory;
      }
    );
    const sortedVolunteers = Object.entries(groupedVolunteers).sort();
    // may not need all these consts; test what happens when event_project_volunteers is null/empty

    // end result: group and count volunteers by subcategory, then render VolunteerSection for each subcategory
    // TODO: Do we need the additional props used on AboutProject for VolunteerSection?
    return (
      <React.Fragment>
        <h3>Team</h3>
        <ProjectOwnersSection owners={eventProject.project_owners} />

        <h3>Total RSVP: ({numVolunteers})</h3>
        {!_.isEmpty(sortedVolunteers) &&
          sortedVolunteers.map(([key, value]) => {
            const roleType: string = key;
            const volunteers: $ReadOnlyArray<VolunteerRSVPDetailsAPIData> = value;
            return (
              <React.Fragment key={roleType}>
                <ul>
                  <li>
                    <h4>
                      {roleType} ({volunteers.length})
                    </h4>
                  </li>
                </ul>
                {volunteers.map((volunteer: VolunteerRSVPDetailsAPIData) => (
                  <RSVPVolunteerCard volunteer={volunteer} />
                ))}
              </React.Fragment>
            );
          })}
      </React.Fragment>
    );
  }

  _renderIconList(): React$Node {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;

    const projectName: string = ProjectAPIUtils.getLocationDisplayName(
      eventProject
    );

    return (
      <React.Fragment>
        {eventProject.event_time_zone && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.Clock, GlyphSizes.LG)} />
            <p className="AboutProject-icon-text">
              {eventProject.event_time_zone.time_zone + " Time Zone"}
            </p>
          </div>
        )}
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.LaptopCode, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            <a
              href={url.section(Section.AboutEvent, {
                id: eventProject.event_id,
              })}
            >
              Global Hackathon Page
            </a>
          </p>
        </div>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.ArrowRight, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            <a
              href={url.section(Section.AboutProject, {
                id: eventProject.project_id,
              })}
            >
              View Project Details
            </a>
          </p>
        </div>
        {projectName && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.MapMarker, GlyphSizes.LG)} />
            <p className="AboutProject-icon-text">{projectName}</p>
          </div>
        )}
        {eventProject.project_url && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.Globe, GlyphSizes.LG)} />
            <p className="AboutProject-url-text">
              <a
                href={urlHelper.appendHttpIfMissingProtocol(
                  eventProject.project_url
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {urlHelper.beautify(eventProject.project_url)}
              </a>
            </p>
          </div>
        )}
      </React.Fragment>
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    const linkOrder = [
      LinkTypes.CODE_REPOSITORY,
      LinkTypes.FILE_REPOSITORY,
      LinkTypes.MESSAGING,
      LinkTypes.PROJECT_MANAGEMENT,
    ];
    const sortedLinks =
      eventProject &&
      eventProject.event_project_links &&
      Sort.byNamedEntries(
        eventProject.event_project_links,
        linkOrder,
        link => link.linkName
      );
    return sortedLinks.map((link, i) => (
      <IconLinkDisplay key={i} link={link} />
    ));
  }

  _renderPositions(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    return (
      eventProject &&
      eventProject.event_project_positions &&
      _.chain(eventProject.event_project_positions)
        .filter(position => !position.isHidden)
        .sortBy(["orderNumber", "id"])
        .value()
        .map((position, i) => {
          return (
            <AboutPositionEntry
              key={i}
              project={eventProject}
              position={position}
              onClickApply={this.handleShowVolunteerModal}
              hideSignInToApply={true}
            />
          );
        })
    );
  }
}

export default AboutProjectEventDisplay;
