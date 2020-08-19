// @flow

import React from 'react';
import moment from 'moment';
import type {ReduceStore} from 'flux/utils';
import EventSearchSort from "./EventSearchSort.jsx";
import EventTagContainer from "./EventTagContainer.jsx";
import {Container} from 'flux/utils';
import {List} from 'immutable'
import EventCard from "./EventCard.jsx";
import EventSearchStore from "../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../stores/EventSearchDispatcher.js";
import LoadingMessage from '../../chrome/LoadingMessage.jsx';
import prerender from "../../utils/prerender.js";
import type {LocationRadius} from "../../stores/ProjectSearchStore.js";
import type {Dictionary} from "../../types/Generics.jsx";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import type {EventTileAPIData} from "../../utils/EventAPIUtils.js";
import utils from "../../utils/utils.js";
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
  showSearchControls: ?boolean,
  staticHeaderText: ?string,
  fullWidth: ?boolean,
|}

type State = {|
  events: List<EventTileAPIData>,
  eventsByDate: $ReadOnlyArray<EventsDateGrouping>,
  event_pages: number,
  current_page: number,
  event_count: number,
  location: LocationRadius,
  tagDictionary: Dictionary<TagDefinition>
|};

class EventCardsContainer extends React.Component<Props, State> {

  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    const events: $ReadOnlyArray = EventSearchStore.getEvents();
    return {
      events: events,
      eventsByDate: events && generateEventsDateListings(events.toJS()),
      event_pages: EventSearchStore.getEventPages(),
      event_count: EventSearchStore.getNumberOfEvents(),
      current_page: EventSearchStore.getCurrentPage(),
      events_loading: EventSearchStore.getEventsLoading(),
      keyword: EventSearchStore.getKeyword() || ''
    };
  }

  render(): React$Node {
    return (
      <div className={`ProjectCardContainer col-12 ${this.props.fullWidth ? '' : 'col-md-8 col-lg-9 p-lg-0 m-lg-0'}`}>
        <div className="container-fluid">
          {
            this.props.showSearchControls
            ? (
              <React.Fragment>
                {/*<EventSearchSort/>*/}
                {/*<EventTagContainer/>*/}
              </React.Fragment>
              )
            : null
          }
          <div className="row EventCards-card-container">
            {/*{!_.isEmpty(this.state.events) && <h2 className="ProjectCardContainer-header">{this._renderCardHeaderText()}</h2>}*/}
            {!_.isEmpty(this.state.events) && this._renderEvents()}
          </div>
          {/*<div>
            {this._renderPagination()}
          </div> */}
        </div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.props.staticHeaderText) {
      return this.props.staticHeaderText;
    } else if (this.state.keyword) {
      return this.state.event_count + " " + utils.pluralize("event", "events", this.state.event_count) + " found";
    } else {
      return 'Find events that match your interests'
    };
  }

  _renderEvents(): React$Node {
    const upcomingPastEvents: Array<$ReadOnlyArray<EventsDateGrouping>> = _.partition(this.state.eventsByDate, (event: EventsDateGrouping) => event.date > moment());
    const upcomingEvents: $ReadOnlyArray<EventsDateGrouping> = _.reverse(upcomingPastEvents[0]);
    const pastEvents: $ReadOnlyArray<EventsDateGrouping> = upcomingPastEvents[1];
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
                  tagDictionary={this.state.tagDictionary}
                />
            )}
          </div>
        </React.Fragment>
      ))
    );
  }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage = this.state.current_page + 1 <= this.state.event_pages
      ? this.state.current_page + 1
      : this.state.current_page;

    this.setState({current_page: nextPage }, function () {
      EventSearchDispatcher.dispatch({
        type: 'SET_PAGE',
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if ((this.state.current_page === this.state.event_pages) && !this.state.events_loading ) {
      return null;
    }
    if (!_.isEmpty(this.state.events) && this.state.events_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">
            Loading...
          </button>
        </div>
      )
    }
    return (
      this.state.events && this.state.events.size !== 0
      ? <div className="page_selection_footer">
        <button className="btn btn-primary" onClick={this._handleFetchNextPage.bind(this)}>
          More Events...
        </button>
      </div>
      : null
    );
  }
}



export default Container.create(EventCardsContainer);
