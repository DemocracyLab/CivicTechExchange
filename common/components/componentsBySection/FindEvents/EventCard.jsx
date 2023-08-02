// @flow

import React from "react";
import Section from "../../../components/enums/Section.js";
import url from "../../utils/url.js";
import Moment from "react-moment";
import moment from "moment";
import { Glyph, GlyphWidth, GlyphStyles } from "../../utils/glyphs.js";
import { EventTileAPIData } from "../../utils/EventAPIUtils.js";

type Props = {|
  event: EventTileAPIData,
  showFullDate: ?boolean,
  maxTextLength: number,
  maxIssuesCount: number,
|};

class EventCard extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    const eventId: string =
      this.props.event.event_slug || this.props.event.event_id;
    return (
      <div className="EventCard-root">
        <a
          href={url.section(Section.AboutEvent, { id: eventId })}
          rel="noopener noreferrer"
        >
          {this._renderEventLogo()}
          {this._renderEventInformation()}
          {this.props.showFullDate
            ? this._renderStartEndDateTime()
            : this._renderEventTime()}
        </a>
      </div>
    );
  }

  _renderEventLogo(): React$Node {
    return (
      <div className="EventCard-logo">
        <img
          src={
            this.props.event && this.props.event.event_thumbnail
              ? this.props.event.event_thumbnail.publicUrl
              : "/static/images/projectlogo-default.png"
          }
        />
      </div>
    );
  }

  //TODO: add organizer field to create event form/db record so we can use that instead
  _renderEventInformation(): React$Node {
    const Event: EventTileAPIData = this.props.event;
    // TODO: List timezones here
    const location: string = Event.event_location;
    return (
      <div className="EventCard-info">
        <h2>{Event.event_name}</h2>
        <h4>{Event.event_organizers_text}</h4>
        {location && (
          <ul>
            <li>
              <i className={Glyph(GlyphStyles.MapMarker, GlyphWidth.Fixed)}></i>
              {location}
            </li>
          </ul>
        )}
      </div>
    );
  }

  _renderEventTime(): React$Node {
    const event: EventTileAPIData = this.props.event;
    return (
      <div className="EventCard-time">
        {event.event_date_start && moment(event.event_date_start) > moment() && (
          <h2>
            <Moment format="LT">{event.event_date_start}</Moment>
          </h2>
        )}
      </div>
    );
  }

  _renderStartEndDateTime(): React$Node {
    const event: EventTileAPIData = this.props.event;
    const dateTimeFormat: string = "LT MMM. D";
    return (
      <div className="EventCard-time">
        {event.event_date_end && moment(event.event_date_end) > moment() && (
          <React.Fragment>
            <h3>Begins:</h3>
            <p>
              <Moment format={dateTimeFormat}>{event.event_date_start}</Moment>
            </p>
            <h3>Ends:</h3>
            <p>
              <Moment format={dateTimeFormat}>{event.event_date_end}</Moment>
            </p>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default EventCard;
