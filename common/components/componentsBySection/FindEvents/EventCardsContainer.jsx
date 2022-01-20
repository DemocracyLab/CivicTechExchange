// @flow

import React from "react";
import type { ReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import { List } from "immutable";
import EventSearchStore from "../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../stores/EventSearchDispatcher.js";
import EventCardsListings from "./EventCardsListings.jsx";
import type { LocationRadius } from "../../stores/ProjectSearchStore.js";
import type { EventTileAPIData } from "../../utils/EventAPIUtils.js";
import utils from "../../utils/utils.js";
import _ from "lodash";

type Props = {|
  showSearchControls: ?boolean,
  staticHeaderText: ?string,
|};

type State = {|
  events: List<EventTileAPIData>,
  event_pages: number,
  current_page: number,
  event_count: number,
  location: LocationRadius,
|};

class EventCardsContainer extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    const events: $ReadOnlyArray = EventSearchStore.getEvents();
    return {
      events: events && events.toJS(),
      event_pages: EventSearchStore.getEventPages(),
      event_count: EventSearchStore.getNumberOfEvents(),
      current_page: EventSearchStore.getCurrentPage(),
      events_loading: EventSearchStore.getEventsLoading(),
      keyword: EventSearchStore.getKeyword() || "",
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col">
        {this.props.showSearchControls ? (
          <React.Fragment>
            {/*<EventSearchSort/>*/}
            {/*<EventTagContainer/>*/}
          </React.Fragment>
        ) : null}
        <div className="row EventCards-card-container">
          {/*{!_.isEmpty(this.state.events) && <h2 className="ProjectCardContainer-header">{this._renderCardHeaderText()}</h2>}*/}
          {!_.isEmpty(this.state.events) && (
            <EventCardsListings
              events={this.state.events}
              showMessageForNoFutureEvents={true}
            />
          )}
        </div>
        {/*<div>
            {this._renderPagination()}
          </div> */}
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.props.staticHeaderText) {
      return this.props.staticHeaderText;
    } else if (this.state.keyword) {
      return (
        this.state.event_count +
        " " +
        utils.pluralize("event", "events", this.state.event_count) +
        " found"
      );
    } else {
      return "Find events that match your interests";
    }
  }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage =
      this.state.current_page + 1 <= this.state.event_pages
        ? this.state.current_page + 1
        : this.state.current_page;

    this.setState({ current_page: nextPage }, function() {
      EventSearchDispatcher.dispatch({
        type: "SET_PAGE",
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if (
      this.state.current_page === this.state.event_pages &&
      !this.state.events_loading
    ) {
      return null;
    }
    if (!_.isEmpty(this.state.events) && this.state.events_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">Loading...</button>
        </div>
      );
    }
    return this.state.events && this.state.events.size !== 0 ? (
      <div className="page_selection_footer">
        <button
          className="btn btn-primary"
          onClick={this._handleFetchNextPage.bind(this)}
        >
          More Events...
        </button>
      </div>
    ) : null;
  }
}

export default Container.create(EventCardsContainer);
