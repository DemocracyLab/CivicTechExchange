// @flow

import React from "react";
import { List } from "immutable";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import EventCardsListings from "../FindEvents/EventCardsListings.jsx";
import { EventTileAPIData, EventData } from "../../utils/EventAPIUtils.js";
import EventCard from "../FindEvents/EventCard.jsx";
import _ from "lodash";

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
          upcomingEvent: getResponse.events,
        })
      );
  }

  render(): React$Node {
    return !_.isEmpty(this.state.upcomingEvent)
      ? this._renderUpcomingSection()
      : null;
  }

  _renderUpcomingSection(): React$Node {
    // get the next upcoming event if there's multiples by selecting index 0
    //TODO: make this component independent/reusable instead of requiring homepage/landing controller classes

    // duplicate EventCard's slug-or-ID function
    const eventURI: string =
      this.state.upcomingEvent[0]["event_slug"] ||
      this.state.upcomingEvent[0]["event_id"];
    return (
      <div className="LandingController-section">
        <h2 className="text-center LandingController-section-header">Our Next Hackathon</h2>
        <EventCard
          event={this.state.upcomingEvent[0]}
          key={"Upcoming-EventCard"}
          maxTextLength={140}
          maxIssuesCount={4}
          showFullDate={true}
        />
        <div className="LandingController-next-hackathon-rsvp">
          <Button
            variant="secondary"
            href={url.section(Section.AboutEvent, {
              id: eventURI,
            })}
          >
            RSVP
          </Button>
        </div>
      </div>
    );
  }
}

export default UpcomingEventCard;
