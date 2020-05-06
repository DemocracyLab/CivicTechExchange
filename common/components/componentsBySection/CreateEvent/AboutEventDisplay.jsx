// @flow

import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import CurrentUser from "../../utils/CurrentUser.js";
import {EventData} from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section";


type Props = {|
  event: ?EventData,
  viewOnly: boolean
|};

type State = {|
  event: ?EventData
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void{
    super();
    this.state = {
      event: props.event
    };
 }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.event !== this.props.event) {
      this.setState({
        event: nextProps.event
      });
    }
  }
  
  render(): ?$React$Node {
    const event:EventData = this.state.event;
    return !event ? null : (
      <div className='AboutProjects-root'>
        <div className="AboutProjects-mainColumn">
          {/*TODO: Date h3*/}
          <h1>{event.event_name}</h1>
          
          <div className="AboutEvent-EventBanner">
            <div className="AboutEvent-Info">
              <h3>Info</h3>
              {/*TODO: Date and Location Info*/}
              {/*TODO: Handle multi-day events*/}
              <h4>Date</h4>
              <p>{moment(event.event_date_start).utc().format("dddd, MMMM Do YYYY")}</p>
              <h4>Time</h4>
              {this._renderTimeRange()}
              <h4>Location</h4>
              <div className="AboutProjects-details-description">
                <p>{this.state.event.event_location}</p>
              </div>
              {this.state.event.event_rsvp_url && this._renderRSVPButton()}
              {!this.props.viewOnly && this._renderJoinLiveEventButton()}
            </div>
            <div className="AboutEvent-Splash">
              <div className='AboutProjects-iconContainer'>
                <img className='AboutProjects-icon' src={event.event_thumbnail.publicUrl} />
              </div>
            </div>
          </div>

          <div className='AboutProjects-details AboutProjects-details-description'>
            <div>
              <h3>Details</h3>
              <div>
                {event.event_short_description}
              </div>
              <div>
                {event.event_description}
              </div>
              <h3>What We Will Do</h3>
              <div>
                {event.event_agenda}
              </div>
            </div>
          </div>
          {/*TODO: Show projects*/}

        </div>

      </div>
    )
  }
  
  _renderTimeRange(): string {
    const timeFormat: string = "h:mm a";
    const timeZone: string = "PST";
    return moment(this.state.event.event_date_start).format(timeFormat) + " - " +
      moment(this.state.event.event_date_end).format(timeFormat) + " " + timeZone;
  }
  
  _renderRSVPButton(): ?$React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        href={this.state.event.event_rsvp_url}
      >
        RSVP on Eventbrite
      </Button>
    );
  }
  
  _renderJoinLiveEventButton(): ?$React$Node {
    let text: string = "";
    let url: string = "";
    if(CurrentUser.isLoggedIn()) {
      //TODO: Handle un-verified users
      text = "Join Event";
      url = urlHelper.section(Section.LiveEvent);
    } else {
      text = "Log In to Join Event";
      url = urlHelper.logInThenReturn();
    }
    
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        title={text}
        href={url}
      >
        {text}
      </Button>
    );
  }
  
}

export default AboutEventDisplay;
