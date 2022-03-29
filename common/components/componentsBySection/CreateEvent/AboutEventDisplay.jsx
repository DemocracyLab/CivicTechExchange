// @flow

import React from "react";
import ReactMarkdown from "react-markdown";
import type Moment from "moment";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import datetime, { DateFormat } from "../../utils/datetime.js";
import CurrentUser, {
  MyProjectData,
  MyRSVPData,
  UserContext,
} from "../../utils/CurrentUser.js";
import { EventData } from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import ProfileProjectSearch from "../../common/projects/ProfileProjectSearch.jsx";
import MainFooter from "../../chrome/MainFooter.jsx";
import PromptNavigationModal from "../../common/PromptNavigationModal.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import NotificationModal from "../../common/notification/NotificationModal.jsx";
import EventProjectAPIUtils from "../../utils/EventProjectAPIUtils.js";
import { ModalSizes } from "../../common/ModalWrapper.jsx";
import ConfirmationModal from "../../common/confirmation/ConfirmationModal.jsx";
import promiseHelper from "../../utils/promise.js";
import Toast from "../../common/notification/Toast.jsx";

type Props = {|
  event: ?EventData,
  viewOnly: boolean,
|};

type State = {|
  event: ?EventData,
  owned_projects: $ReadOnlyArray<MyProjectData>,
  participating_projects: ?$ReadOnlyArray<MyProjectData>,
  isVolunteerRSVPed: boolean,
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
    const participating_projects: ?$ReadOnlyArray<MyProjectData> =
      !_.isEmpty(userContext?.owned_projects) &&
      userContext.owned_projects.filter((project: MyProjectData) =>
        CurrentUser.isOwner(project)
      );
    const isVolunteerRSVPed: boolean = _.some(
      userContext?.rsvp_events,
      (rsvp: MyRSVPData) => rsvp.event_id === props.event.event_id
    );
    this.state = {
      event: props.event,
      owned_projects: userContext?.owned_projects,
      participating_projects: participating_projects,
      isVolunteerRSVPed: isVolunteerRSVPed,
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
        {/*TODO: Verify we want these toasts*/}
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
                  event.event_live_id &&
                  this._renderJoinLiveEventButton()}
                {!this.props.viewOnly &&
                  !this.state.isPastEvent &&
                  !this.state.isVolunteerRSVPed &&
                  this._renderRSVPAsVolunteerButton()}
                {!this.props.viewOnly &&
                  !this.state.isPastEvent &&
                  this.state.isVolunteerRSVPed &&
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

          <div className="AboutEvent-details row">
            <div className="col-12">
              <h3>Details</h3>
              <ReactMarkdown children={event.event_description} />
              <h3>What We Will Do</h3>
              <ReactMarkdown children={event.event_agenda} />
            </div>
          </div>
          {!_.isEmpty(event.event_legacy_organization) && (
            <ProfileProjectSearch viewOnly={this.props.viewOnly} />
          )}
        </div>
        <MainFooter key="main_footer" forceShow={event.show_headers} />
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
      buttonConfig = {
        onClick: () => {
          EventProjectAPIUtils.rsvpForEvent(
            this.props.event.event_id,
            response => {
              this.setState({
                showPostRSVPModal: true,
              });
            }
          );
        },
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
          message="Your next step is to select a project.  If you don't see a project you like, please come back closer to the hackathon."
          buttonText="Ok"
          headerText="Thank you for RSVPing!"
          onClickButton={() =>
            this.setState({
              showPostRSVPModal: false,
              showPostRSVPToast: true,
              isVolunteerRSVPed: true,
            })
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
          message="If you cancel your RSVP, you will be removed from the the hackathon.  Do you want to continue?"
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
    let url: string = "";
    if (CurrentUser.isLoggedIn()) {
      //TODO: Handle un-verified users
      text = "Join Event";
      //TODO: Incorporate live event id into Live Event page
      url = urlHelper.section(Section.LiveEvent, {
        id: this.props.event.event_live_id,
      });
    } else {
      text = "Log In to Join Event";
      url = urlHelper.logInThenReturn();
    }

    return (
      <Button
        variant="success"
        size="lg"
        className="AboutEvent-join-btn"
        type="button"
        title={text}
        href={url}
      >
        {text}
      </Button>
    );
  }

  initProjectSearch() {
    const event: EventData = this.state.event;
    if (event && !_.isEmpty(event.event_legacy_organization)) {
      UniversalDispatcher.dispatch({
        type: "INIT_PROJECT_SEARCH",
        findProjectsArgs: {
          event_id: event.event_id,
          sortField: "project_name",
        },
        searchSettings: {
          updateUrl: false,
          defaultSort: "project_name",
        },
      });
    }
  }
}

export default AboutEventDisplay;
