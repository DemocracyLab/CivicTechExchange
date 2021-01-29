// @flow

import React from "react";
import { Container } from "flux/utils";
import CurrentUser from "../utils/CurrentUser.js";
import MyEventsStore, {
  MyEventData,
  MyEventsAPIResponse,
} from "../stores/MyEventsStore.js";
import EventCardsListings from "../componentsBySection/FindEvents/EventCardsListings.jsx";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import _ from "lodash";

type State = {|
  ownedEvents: ?Array<MyEventData>,
  privateEvents: ?Array<MyEventData>,
|};

class MyEventsController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      ownedEvents: null,
      privateEvents: null,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [MyEventsStore];
  }

  static calculateState(prevState: State): State {
    const myEvents: MyEventsAPIResponse = MyEventsStore.getMyEvents();
    return {
      ownedEvents: myEvents && myEvents.owned_events,
      privateEvents: myEvents && myEvents.private_events,
    };
  }

  render(): React$Node {
    if (!CurrentUser.isLoggedIn) {
      return <LogInController prevPage={Section.MyEvents} />;
    }

    return (
      // TODO: Headers
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

export default Container.create(MyEventsController);
