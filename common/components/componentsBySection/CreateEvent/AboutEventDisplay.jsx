// @flow

import React from "react";
import type Moment from "moment";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import datetime, { DateFormat } from "../../utils/datetime.js";
import CurrentUser, {
  MyEventProjectData,
  MyProjectData,
  MyRSVPData,
  UserContext,
} from "../../utils/CurrentUser.js";
import { EventData } from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import ProfileProjectSearch from "../../common/projects/ProfileProjectSearch.jsx";
import SponsorFooter from "../../chrome/SponsorFooter.jsx";
import PromptNavigationModal from "../../common/PromptNavigationModal.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import NotificationModal from "../../common/notification/NotificationModal.jsx";
import EventProjectAPIUtils from "../../utils/EventProjectAPIUtils.js";
import { ModalSizes } from "../../common/ModalWrapper.jsx";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import promiseHelper from "../../utils/promise.js";
import Toast from "../../common/notification/Toast.jsx";
import type {
  CardOperation,
  ProjectData,
} from "../../utils/ProjectAPIUtils.js";
import JoinConferenceButton from "../../common/event_projects/JoinConferenceButton.jsx";
import { SearchFor } from "../../stores/EntitySearchStore.js";
import AllowMarkdown from "../../common/richtext/AllowMarkdown.jsx";
import EventProjectRSVPModal from "../../common/event_projects/EventProjectRSVPModal.jsx";

type Props = {|
  event: ?EventData,
  viewOnly: boolean,
|};

type State = {|
  event: ?EventData,
  owned_projects: $ReadOnlyArray<MyProjectData>,
  volunteering_projects: ?$ReadOnlyArray<MyProjectData>,
  isProjectOwnerRSVPed: boolean,
  isVolunteerRSVPed: boolean,
  isVolunteerRSVPedForEventOnly: boolean,
  showRSVPLocationModal: boolean,
  showPromptCreateProjectModal: boolean,
  showPostRSVPModal: boolean,
  showCancelRSVPConfirmModal: boolean,
  showPostRSVPToast: boolean,
  showPostCancelRSVPToast: boolean,
  startDate: Moment,
  endDate: Moment,
  isPastEvent: boolean,
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    const userContext: UserContext = CurrentUser?.userContext();
    const startDate: Moment = datetime.parse(props.event.event_date_start);
    const endDate: Moment = datetime.parse(props.event.event_date_end);
    const isProjectOwnerRSVPed: boolean = !_.isEmpty(
      userContext?.event_projects
    );
    const volunteering_projects: ?$ReadOnlyArray<MyProjectData> = userContext?.rsvp_events?.filter(
      (rsvp: MyRSVPData) => rsvp.event_id === props.event.event_id
    );
    const isVolunteerRSVPedForEventOnly: boolean =
      !_.isEmpty(volunteering_projects) &&
      volunteering_projects.length == 1 &&
      !volunteering_projects[0].project_id;
    this.state = {
      event: props.event,
      owned_projects: userContext?.owned_projects,
      volunteering_projects: volunteering_projects,
      isProjectOwnerRSVPed: isProjectOwnerRSVPed,
      isVolunteerRSVPed: !_.isEmpty(volunteering_projects),
      isVolunteerRSVPedForEventOnly: isVolunteerRSVPedForEventOnly,
      showRSVPLocationModal: false,
      showPromptCreateProjectModal: false,
      showPostRSVPModal: false,
      showCancelRSVPConfirmModal: false,
      startDate: startDate,
      endDate: endDate,
      isPastEvent: endDate < datetime.now(),
      showPostRSVPToast: false,
      showPostCancelRSVPToast: false,
    };

    if (this.state.event) {
      this.initProjectSearch();
    }
    this.handleRSVPClose = this.handleRSVPClose.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.event !== this.props.event) {
      this.setState(
        {
          event: nextProps.event,
        },
        this.initProjectSearch
      );
    }
  }

  handleRSVPClose(submitted: boolean) {
    this.setState({
      showRSVPLocationModal: false,
      showPostRSVPModal: submitted,
    });
  }

  render(): ?$React$Node {
    const event: EventData = this.state.event;
    const startDate: Moment = this.state.startDate;
    const endDate: Moment = this.state.endDate;
    const isSingleDayEvent: boolean = datetime.isOnSame(
      "day",
      startDate,
      endDate
    );
    return !event ? null : (
      <React.Fragment>
        <Toast
          show={this.state.showPostRSVPToast}
          onClose={() => this.setState({ showPostRSVPToast: false })}
          timeoutMilliseconds={4000}
        >
          You have RSVP-ed successfully to the event.
        </Toast>

        <Toast
          show={this.state.showPostCancelRSVPToast}
          onClose={() => this.setState({ showPostCancelRSVPToast: false })}
          timeoutMilliseconds={4000}
        >
          You have canceled your RSVP to the event.
        </Toast>

        <div className="AboutEvent-root container">
          <div className="AboutEvent-title row">
            <div className="col-12 AboutEvent-header">
              {!this.props.viewOnly &&
                (CurrentUser.userID() === this.state.event.event_creator ||
                  CurrentUser.isStaff()) &&
                this._renderEditButton()}
              <div className="AboutEvent-title-date">
                <h4>{startDate.format(DateFormat.MONTH_DATE_YEAR)}</h4>
              </div>
              <h1>{event.event_name}</h1>
              <p>{event.event_short_description}</p>
            </div>
          </div>

          <div className="AboutEvent-EventBanner row">
            <div className="AboutEvent-info col-xs-12 col-lg-4">
              <div className="AboutEvent-info-inner">
                <h3>Info</h3>
                {this.state.event.event_organizers_text && (
                  <React.Fragment>
                    <h5 className="AboutEvent-info-header">Organizers</h5>
                    <div className="AboutEvent-location">
                      <p>{this.state.event.event_organizers_text}</p>
                    </div>
                  </React.Fragment>
                )}

                {isSingleDayEvent
                  ? this._renderDateTimeSections(startDate, endDate)
                  : this._renderDatesSection(startDate, endDate)}

                <h5 className="AboutEvent-info-header">Location</h5>
                <div className="AboutEvent-location">
                  <p>{this.state.event.event_location}</p>
                </div>

                {this.state.event.event_rsvp_url && this._renderRSVPButton()}
                {!this.props.viewOnly &&
                  event.is_activated &&
                  this._renderJoinLiveEventButton()}
                {!this.props.viewOnly &&
                  !this.state.isPastEvent &&
                  !this.state.isVolunteerRSVPed &&
                  !this.state.isProjectOwnerRSVPed &&
                  this._renderRSVPAsVolunteerButton()}
                {!this.props.viewOnly &&
                  !this.state.isPastEvent &&
                  this.state.isVolunteerRSVPedForEventOnly &&
                  this._renderCancelVolunteerRSVPButton()}
                {!this.props.viewOnly &&
                  !this.state.isPastEvent &&
                  !this.state.isVolunteerRSVPed &&
                  this._renderRSVPAsProjectOwnerButton()}
              </div>
            </div>
            <div className="col-xs-12 col-lg-8 AboutEvent-splash">
              <img
                src={event.event_thumbnail && event.event_thumbnail.publicUrl}
              />
            </div>
          </div>

          <div className="AboutEvent-details row justify-content-center">
            <div className="col-12 col-lg-9">
              <h3>Details</h3>
              <AllowMarkdown children={event.event_description} />
              <h3>What We Will Do</h3>
              <AllowMarkdown children={event.event_agenda} />
            </div>
          </div>
          <ProfileProjectSearch viewOnly={this.props.viewOnly} />
        </div>
        <SponsorFooter key="main_footer" forceShow={event.show_headers} />
      </React.Fragment>
    );
  }

  _renderDatesSection(startDate: Moment, endDate: Moment): $React$Node {
    return (
      <React.Fragment>
        <h5 className="AboutEvent-info-header">Dates</h5>
        <p>{startDate.format(DateFormat.DAY_MONTH_DATE_YEAR_TIME)}</p>
        <h6>To</h6>
        <p>{endDate.format(DateFormat.DAY_MONTH_DATE_YEAR_TIME)}</p>
      </React.Fragment>
    );
  }

  _renderDateTimeSections(startDate: Moment, endDate: Moment): $React$Node {
    return (
      <React.Fragment>
        <h5 className="AboutEvent-info-header">Date</h5>
        <p>{startDate.format(DateFormat.DAY_MONTH_DATE_YEAR)}</p>

        <h5 className="AboutEvent-info-header">Time</h5>
        <p>
          {startDate.format(DateFormat.TIME) +
            " - " +
            endDate.format(DateFormat.TIME_TIMEZONE)}
        </p>
      </React.Fragment>
    );
  }

  _renderEditButton(): ?$React$Node {
    return (
      <Button
        variant="primary"
        className="AboutEvent-edit-btn"
        type="button"
        href={urlHelper.section(Section.CreateEvent, {
          id: this.state.event.event_id,
        })}
      >
        Edit Event
      </Button>
    );
  }

  _renderRSVPButton(): ?$React$Node {
    const eventbriteTest = new RegExp("eventbrite.com", "i");
    const url: string = urlHelper.appendHttpIfMissingProtocol(
      this.state.event.event_rsvp_url
    );
    const text: string =
      "RSVP" + (eventbriteTest.test(url) ? " on Eventbrite" : "");
    return (
      <Button
        variant="primary"
        className="AboutEvent-rsvp-btn"
        type="button"
        href={url}
        target="_blank"
      >
        {text}
      </Button>
    );
  }

  _renderRSVPAsVolunteerButton(): ?$React$Node {
    // TODO: Add spinner while RSVP call is in progress
    let buttonConfig: Dictionary<any> = {};
    if (CurrentUser.isLoggedIn()) {
      const onClick: () => void = !_.isEmpty(
        this.state?.event?.event_time_zones
      )
        ? () => {
            // If there are multiple locations, show RSVP location modal
            this.setState({ showRSVPLocationModal: true });
          }
        : () => {
            // If single location, RSVP then show post-RSVP modal
            EventProjectAPIUtils.rsvpForEvent(
              this.props.event.event_id, false, null,
              response => {
                this.setState({
                  showPostRSVPModal: true,
                });
              }
            );
          };

      buttonConfig = {
        onClick: onClick,
      };
    } else {
      // If not logged in, go to login page
      buttonConfig = { href: urlHelper.logInThenReturn() };
    }

    return (
      <React.Fragment>
        <NotificationModal
          showModal={this.state.showPostRSVPModal}
          size={ModalSizes.Medium}
          message="Your next step is to select a project.  If you don't see a project you like, please check back closer to the hackathon."
          buttonText="Ok"
          headerText="Thank you for RSVPing!"
          onClickButton={() =>
            this.setState({
              showPostRSVPModal: false,
              showPostRSVPToast: true,
              isVolunteerRSVPed: true,
              isVolunteerRSVPedForEventOnly: true,
            })
          }
        />

        <EventProjectRSVPModal
          event={this.state.event}
          showModal={this.state.showRSVPLocationModal}
          handleClose={(submitted) => this.handleRSVPClose(submitted)}
          conferenceUrl={
            this.state?.event?.event_conference_admin_url ||
            this.state?.event?.event_conference_url
          }
        />

        <Button
          variant="primary"
          className="AboutEvent-rsvp-btn"
          type="button"
          {...buttonConfig}
        >
          RSVP as Project Volunteer
        </Button>
      </React.Fragment>
    );
  }

  _renderCancelVolunteerRSVPButton(): ?$React$Node {
    // TODO: Add spinner while cancel call is in progress
    let buttonConfig: Dictionary<any> = {};
    if (CurrentUser.isLoggedIn()) {
      buttonConfig = {
        onClick: () =>
          this.setState({
            showCancelRSVPConfirmModal: true,
          }),
      };
    } else {
      // If not logged in, go to login page
      buttonConfig = { href: urlHelper.logInThenReturn() };
    }

    return (
      <React.Fragment>
        <ConfirmationModal
          showModal={this.state.showCancelRSVPConfirmModal}
          headerText="Cancel Your RSVP?"
          message="If you cancel your RSVP, you will be removed from the hackathon.  Do you want to continue?"
          reverseCancelConfirm={true}
          onSelection={(canceled: boolean) => {
            if (canceled) {
              return EventProjectAPIUtils.rsvpEventCancel(
                this.props.event.event_id,
                response => {
                  this.setState({
                    showCancelRSVPConfirmModal: false,
                    showPostCancelRSVPToast: true,
                    isVolunteerRSVPed: false,
                    isVolunteerRSVPedForEventOnly: false,
                  });
                }
              );
            } else {
              return promiseHelper.promisify(() =>
                this.setState({
                  showCancelRSVPConfirmModal: false,
                })
              );
            }
          }}
        />

        <Button
          variant="primary"
          className="AboutEvent-rsvp-btn"
          type="button"
          {...buttonConfig}
        >
          Cancel RSVP
        </Button>
      </React.Fragment>
    );
  }

  _renderRSVPAsProjectOwnerButton(): ?$React$Node {
    // TODO: Don't show when a user has rsvp-ed all their projects with this event
    let buttonConfig: Dictionary<any> = {};
    if (CurrentUser.isLoggedIn()) {
      if (!_.isEmpty(this.state.owned_projects)) {
        // Go to create event project page if user has projects
        buttonConfig = {
          href: urlHelper.section(Section.CreateEventProject, {
            event_id: this.state.event.event_id,
          }),
        };
      } else {
        // If no projects, open create project prompt
        buttonConfig = {
          onClick: () => this.setState({ showPromptCreateProjectModal: true }),
        };
      }
    } else {
      // If not logged in, go to login page
      buttonConfig = { href: urlHelper.logInThenReturn() };
    }

    return (
      <React.Fragment>
        <PromptNavigationModal
          showModal={this.state.showPromptCreateProjectModal}
          submitUrl={
            urlHelper.section(Section.CreateProject) +
            "?fromEventId=" +
            this.state.event.event_id
          }
          headerText="Create a Project on DemocracyLab.org?"
          cancelText="Cancel"
          submitText="Create Project"
          onCancel={() =>
            this.setState({ showPromptCreateProjectModal: false })
          }
        >
          You must create a project on DemocracyLab.org to join the hackathon as
          a project leader.
        </PromptNavigationModal>

        <Button
          variant="primary"
          className="AboutEvent-rsvp-btn"
          type="button"
          {...buttonConfig}
        >
          RSVP as Project Leader
        </Button>
      </React.Fragment>
    );
  }

  _renderJoinLiveEventButton(): ?$React$Node {
    let text: string = "";
    let buttonConfig: Dictionary<any> = {
      target: "_self",
    };
    if (CurrentUser.isLoggedIn()) {
      text = "Join Main Session";
      buttonConfig.href =
        this.props.event.event_conference_admin_url ||
        this.props.event.event_conference_url;
      buttonConfig.target = "_blank";
    } else {
      text = "Join Event";
      buttonConfig.href = urlHelper.logInThenReturn();
    }

    return this.props.event.is_activated ? (
      <JoinConferenceButton
        buttonConfig={buttonConfig}
        participant_count={this.props.event.event_conference_participants}
        className="AboutEvent-rsvp-btn JoinConference-livebutton"
      >
        {text}
      </JoinConferenceButton>
    ) : (
      <Button
        variant="primary"
        type="button"
        className="AboutEvent-rsvp-btn JoinConference-livebutton"
        title={text}
        {...buttonConfig}
      >
        {text}
      </Button>
    );
  }

  _cardOperationGenerator(project: ProjectData): ?CardOperation {
    // TODO: Show signup modal on click
    const isVolunteering: boolean =
      !_.isEmpty(this.state.volunteering_projects) &&
      this.state.volunteering_projects.find(
        (myProject: MyProjectData) => myProject.project_id == project.id
      );

    const isOwner: boolean =
      !_.isEmpty(this.state.owned_projects) &&
      this.state.owned_projects.find(
        (myProject: MyProjectData) => myProject.project_id == project.id
      );
    if (this.props.event.is_activated) {
      if (isVolunteering || isOwner) {
        return {
          name: "Join Project Video",
          url: project.conferenceUrl,
          target: "_blank",
          count: project.conferenceCt,
          buttonVariant: "success",
        };
      } else {
        return {
          name: "Review Project Details",
          url: project.cardUrl,
          count: project.conferenceCt,
          buttonVariant: "outline-secondary",
        };
      }
    } else {
      if (isVolunteering || isOwner) {
        return {
          name: "View Details",
          buttonVariant: "outline-secondary",
          url: project.cardUrl,
        };
      } else if (CurrentUser.isLoggedIn() && !isVolunteering) {
        return {
          name: "Sign Up",
          url: project.cardUrl + "?signUp=1",
        };
      }
    }
  }

  initProjectSearch() {
    const event: EventData = this.state.event;
    if (event?.event_id) {
      UniversalDispatcher.dispatch({
        type: "INIT_SEARCH",
        findProjectsArgs: {
          event_id: event.event_id,
          sortField: "project_name",
        },
        searchSettings: {
          updateUrl: false,
          searchConfig: SearchFor.Projects,
          cardOperationGenerator:
            !this.state.isPastEvent && this._cardOperationGenerator.bind(this),
        },
      });
    }
  }
}

export default AboutEventDisplay;
