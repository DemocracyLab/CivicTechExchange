// @flow

import React from "react";
import CurrentUser, { UserContext, MyEventData } from "../utils/CurrentUser.js";
import EventCardsListings from "../componentsBySection/FindEvents/EventCardsListings.jsx";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import _ from "lodash";

type State = {|
  ownedEvents: ?Array<MyEventData>,
  privateEvents: ?Array<MyEventData>,
|};

class MyEventsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      ownedEvents: userContext.owned_events,
      privateEvents: userContext.private_events,
    };
  }

  render(): React$Node {
    if (!CurrentUser.isLoggedIn) {
      return <LogInController prevPage={Section.MyEvents} />;
    }

    return (
      <React.Fragment>
        <div className="MyEventsController-root container">
          {this.renderEvents("Owned Events", this.state.ownedEvents)}
          {this.renderEvents("All Private Events", this.state.privateEvents)}
        </div>
      </React.Fragment>
    );
  }

  renderEvents(
    title: string,
    events: $ReadOnlyArray<MyGroupData>
  ): ?React$Node {
    return (
      !_.isEmpty(events) && (
        <div className="row MyEvents-eventsection">
          <div className="col-12">
            <h1>{title}</h1>
            <EventCardsListings
              events={events}
              showMessageForNoFutureEvents={false}
            />
          </div>
        </div>
      )
    );
  }
}

export default MyEventsController;
