// @flow

import React from "react";
import Linkify from "react-linkify";
import type Moment from "moment";
import datetime, { DateFormat } from "../../utils/datetime.js";
import Button from "react-bootstrap/Button";
import CurrentUser from "../../utils/CurrentUser.js";
import { EventData } from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import ProfileProjectSearch from "../../common/projects/ProfileProjectSearch.jsx";
import _ from "lodash";
import MainFooter from "../../chrome/MainFooter.jsx"
import ChangeOwnerButton from "../../common/owners/ChangeOwnerButton.jsx";

type Props = {|
  event: ?EventData,
  viewOnly: boolean,
|};

type State = {|
  event: ?EventData,
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      event: props.event,
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
                this._renderEditButton() &&
                this._renderChangeOwnerButton()}
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
              <Linkify>
                <h3>Details</h3>
                <p>{event.event_description}</p>
                <h3>What We Will Do</h3>
                <p>{event.event_agenda}</p>
              </Linkify>
            </div>
          </div>
          {!_.isEmpty(event.event_legacy_organization) && (
            <ProfileProjectSearch viewOnly={this.props.viewOnly} />
          )}
        </div>
        <MainFooter key="main_footer" forceShow={event.show_headers}/>
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

  _renderChangeOwnerButton(): ?React$Node {
    return <ChangeOwnerButton event={this.state.event} />
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
      ProjectSearchDispatcher.dispatch({
        type: "INIT",
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
