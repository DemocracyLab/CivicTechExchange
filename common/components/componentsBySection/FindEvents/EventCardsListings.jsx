// @flow

import React from "react";
import moment from "moment";
import EventCard from "./EventCard.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import type { EventTileAPIData } from "../../utils/EventAPIUtils.js";
import _ from "lodash";

type EventsDateGrouping = {|
  date: Date,
  dateString: string,
  events: $ReadOnlyArray<EventTileAPIData>,
|};

const dateHeaderFormat: string = "dddd, MMMM D, YYYY";

function generateEventsDateListings(
  events: $ReadOnlyArray<EventTileAPIData>
): $ReadOnlyArray<EventsDateGrouping> {
  const groupings: Dictionary<EventTileAPIData> = _.groupBy(
    events,
    (event: EventTileAPIData) => {
      return moment(event.event_date_start)
        .startOf("day")
        .format(dateHeaderFormat);
    }
  );

  const eventsDateListings: $ReadOnlyArray<EventsDateGrouping> = Object.keys(
    groupings
  ).map(dateKey => {
    return {
      date: moment(dateKey, dateHeaderFormat),
      dateString: dateKey,
      events: _.sortBy(groupings[dateKey], ["event_date_start"]),
    };
  });

  return _.reverse(_.sortBy(eventsDateListings, ["date"]));
}

type Props = {|
  events: $ReadOnlyArray<EventTileAPIData>,
  showMessageForNoFutureEvents: boolean,
|};

type State = {|
  events: $ReadOnlyArray<EventTileAPIData>,
  eventsByDate: $ReadOnlyArray<EventsDateGrouping>,
|};

class EventCardsListings extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();

    this.state = {
      events: props.events,
      eventsByDate: props.events && generateEventsDateListings(props.events),
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return {
      events: nextProps.events,
      eventsByDate:
        nextProps.events && generateEventsDateListings(nextProps.events),
    };
  }

  render(): React$Node {
    const upcomingPastEvents: Array<$ReadOnlyArray<EventsDateGrouping>> =
      this.state.eventsByDate &&
      _.partition(
        this.state.eventsByDate,
        (event: EventsDateGrouping) => event.date > moment()
      );
    const upcomingEvents: $ReadOnlyArray<EventsDateGrouping> =
      upcomingPastEvents && _.reverse(upcomingPastEvents[0]);
    const pastEvents: $ReadOnlyArray<EventsDateGrouping> =
      upcomingPastEvents && upcomingPastEvents[1];
    return (
      <React.Fragment>
        {this._renderUpcomingEvents(upcomingEvents)}
        {pastEvents && this._renderPastEvents(pastEvents)}
      </React.Fragment>
    );
  }

  // TODO: Make header size configurable
  _renderUpcomingEvents(
    upcomingEvents: $ReadOnlyArray<EventsDateGrouping>
  ): React$Node {
    const showUpcomingEvents: boolean =
      this.props.showMessageForNoFutureEvents || !_.isEmpty(upcomingEvents);
    return (
      <React.Fragment>
        {showUpcomingEvents && (
          <h2 className="EventCardContainer-section-header">Upcoming Events</h2>
        )}
        {!_.isEmpty(upcomingEvents) ? (
          <React.Fragment>
            {this._renderEventsGrouping(upcomingEvents)}
          </React.Fragment>
        ) : (
          this.props.showMessageForNoFutureEvents && (
            <div className="EventCard-day-container">
              <p>No events currently scheduled, check back soon!</p>
            </div>
          )
        )}
      </React.Fragment>
    );
  }

  _renderPastEvents(
    pastEvents: $ReadOnlyArray<EventsDateGrouping>
  ): React$Node {
    return (
      <React.Fragment>
        {!_.isEmpty(pastEvents) && (
          <React.Fragment>
            <h2 className="EventCardContainer-section-header">Past Events</h2>
            {this._renderEventsGrouping(pastEvents)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  _renderEventsGrouping(
    eventsByDate: $ReadOnlyArray<EventsDateGrouping>
  ): React$Node {
    return eventsByDate.map(input => (
      <React.Fragment>
        <h4 className="EventCard-dateheader">{input.dateString}</h4>
        <div className="EventCard-day-container">
          {input.events.map((event: EventsDateGrouping, index: number) => (
            <EventCard
              event={event}
              key={index}
              maxTextLength={140}
              maxIssuesCount={4}
            />
          ))}
        </div>
      </React.Fragment>
    ));
  }
}

export default EventCardsListings;
