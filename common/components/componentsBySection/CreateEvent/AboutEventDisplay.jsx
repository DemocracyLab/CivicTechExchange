// @flow

import React from "react";
import ReactMarkdown from "react-markdown";
import type Moment from "moment";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import datetime, { DateFormat } from "../../utils/datetime.js";
import CurrentUser, {
  MyProjectData,
  UserContext,
} from "../../utils/CurrentUser.js";
import { EventData } from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import ProfileProjectSearch from "../../common/projects/ProfileProjectSearch.jsx";
import MainFooter from "../../chrome/MainFooter.jsx";

type Props = {|
  event: ?EventData,
  viewOnly: boolean,
|};

type State = {|
  event: ?EventData,
  owned_projects: $ReadOnlyArray<MyProjectData>,
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    const userContext: UserContext = CurrentUser?.userContext();
    this.state = {
      event: props.event,
      owned_projects: userContext?.owned_projects,
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
    const startDate: Moment = datetime.parse(event.event_date_start);
    const endDate: Moment = datetime.parse(event.event_date_end);
    const isSingleDayEvent: boolean = datetime.isOnSame(
      "day",
      startDate,
      endDate
    );
    return !event ? null : (
      <React.Fragment>
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
                {this._renderRSVPAsProjectOwnerButton()}
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
      >
        {text}
      </Button>
    );
  }

  _renderRSVPAsProjectOwnerButton(): ?$React$Node {
    // TODO: Don't show when a user has rsvp-ed all their projects with this event
    const show: boolean =
      !this.props.viewOnly && !_.isEmpty(this.state.owned_projects);
    const url: string = urlHelper.section(Section.CreateEventProject, {
      event_id: this.state.event.event_id,
    });
    return (
      show && (
        <Button
          variant="primary"
          className="AboutEvent-rsvp-btn"
          type="button"
          href={url}
        >
          RSVP as Project Leader
        </Button>
      )
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
