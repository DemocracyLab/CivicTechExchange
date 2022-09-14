// @flow

import React from "react";
import { List } from "immutable";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import EventCardsListings from "../FindEvents/EventCardsListings.jsx";
import { EventTileAPIData, EventData } from "../../utils/EventAPIUtils.js";


type State = {|
  upcomingEvent: List<EventTileAPIData>,
|};

class UpcomingEventCard extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      upcomingEvent: null,
    };
  }

  componentDidMount() {
    const url: string = "/api/events/upcoming";
    fetch(new Request(url))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          upcomingEvent: getResponse.events
        })
      );
  }

  render(): React$Node {
    console.log(this.state);
    return (
      <div className="UpcomingEvent-root">
        <p>(placeholder for upcoming hackathon card)</p>
      </div>
    );
  }
}

export default UpcomingEventCard;
