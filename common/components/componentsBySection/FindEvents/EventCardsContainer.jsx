// @flow

import React from "react";
import type { ReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import { List } from "immutable";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import type { LocationRadius } from "../../common/location/LocationRadius.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";
import EventCardsListings from "./EventCardsListings.jsx";
import type { EventTileAPIData } from "../../utils/EventAPIUtils.js";
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
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const events: $ReadOnlyArray = EntitySearchStore.getEntities();
    return {
      events: events && events.toJS(),
      event_pages: EntitySearchStore.getEntityPages(),
      event_count: EntitySearchStore.getNumberOfEntities(),
      current_page: EntitySearchStore.getCurrentPage(),
      events_loading: EntitySearchStore.isLoading(),
      keyword: EntitySearchStore.getKeyword() || "",
    };
  }

  render(): React$Node {
    return !this.state.events ? (
      <LoadingFrame height="80vh" />
    ) : (
      <div className="ProjectCardContainer col">
        {this.props.showSearchControls ? (
          <React.Fragment>
            {/*<EntitySearchSort/>*/}
            {/*<EntityTagContainer/>*/}
          </React.Fragment>
        ) : null}
        <div className="row EventCards-card-container">
          {!_.isEmpty(this.state.events) && (
            <EventCardsListings
              events={this.state.events}
              showMessageForNoFutureEvents={true}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Container.create(EventCardsContainer);
