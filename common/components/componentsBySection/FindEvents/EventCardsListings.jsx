// @flow

import React from 'react';
import moment from 'moment';
import EventCard from "./EventCard.jsx";
import type {Dictionary} from "../../types/Generics.jsx";
import type {EventTileAPIData} from "../../utils/EventAPIUtils.js";
import _ from 'lodash';

type EventsDateGrouping = {|
  date: Date,
  dateString: string,
  events: $ReadOnlyArray<EventTileAPIData>
|};

const dateHeaderFormat: string = "dddd, MMMM D, YYYY";

function generateEventsDateListings(events: $ReadOnlyArray<EventTileAPIData>): $ReadOnlyArray<EventsDateGrouping> {
  const groupings: Dictionary<EventTileAPIData> =  _.groupBy(events, (event: EventTileAPIData) => {
    return moment(event.event_date_start).startOf('day').format(dateHeaderFormat)
  });

  const eventsDateListings: $ReadOnlyArray<EventsDateGrouping> = Object.keys(groupings).map( (dateKey) => {
    return {
      date: moment(dateKey, dateHeaderFormat),
      dateString: dateKey,
      events: _.sortBy(groupings[dateKey], ['event_date_start'])
    }
  });

  return _.reverse(_.sortBy(eventsDateListings, ['date']));
}

type Props = {|
  events: $ReadOnlyArray<EventTileAPIData>
|}

type State = {|
  events: $ReadOnlyArray<EventTileAPIData>,
  eventsByDate: $ReadOnlyArray<EventsDateGrouping>
|};

class EventCardsListings extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
    
    this.state = {
      events: props.events,
      eventsByDate: props.events && generateEventsDateListings(props.events)
    };
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      events: nextProps.events,
      eventsByDate: nextProps.events && generateEventsDateListings(nextProps.events)
    });
  }
  
  render(): React$Node {
    const upcomingPastEvents: Array<$ReadOnlyArray<EventsDateGrouping>> = this.state.eventsByDate && _.partition(this.state.eventsByDate, (event: EventsDateGrouping) => event.date > moment());
    const upcomingEvents: $ReadOnlyArray<EventsDateGrouping> = upcomingPastEvents && _.reverse(upcomingPastEvents[0]);
    const pastEvents: $ReadOnlyArray<EventsDateGrouping> = upcomingPastEvents && upcomingPastEvents[1];
    return (
      <React.Fragment>
        <h1 className="EventCardContainer-section-header">Upcoming Events</h1>
        {!_.isEmpty(upcomingEvents) ? (
          <React.Fragment>
            {this._renderEventsGrouping(upcomingEvents)}
          </React.Fragment>
        ) : (<div className="EventCard-day-container"><p>No events currently scheduled, check back soon!</p></div>)
        }
        {!_.isEmpty(pastEvents) && (
          <React.Fragment>
            <h1 className="EventCardContainer-section-header">Past Events</h1>
            {this._renderEventsGrouping(pastEvents)}
          </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }

  _renderEventsGrouping(eventsByDate: $ReadOnlyArray<EventsDateGrouping>): React$Node {
    return (eventsByDate.map((input) => (
        <React.Fragment>
          <h4 className="EventCard-dateheader">{input.dateString}</h4>
          <div className="EventCard-day-container">
            {input.events.map(
              (event: EventsDateGrouping, index: number) =>
                <EventCard
                  event={event}
                  key={index}
                  maxTextLength={140}
                  maxIssuesCount={4}
                />
            )}
          </div>
        </React.Fragment>
      ))
    );
  }

}

export default EventCardsListings;
