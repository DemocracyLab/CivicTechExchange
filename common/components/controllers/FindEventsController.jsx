// @flow

import Headers from "../common/Headers.jsx";
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import EventCardsContainer from "../componentsBySection/FindEvents/EventCardsContainer.jsx";
import EventFilterContainer from "../componentsBySection/FindEvents/filters/EventFilterContainer.jsx";
import React from 'react';

class FindEventsController extends React.PureComponent {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="DemocracyLab"
          description="Optimizing the connection between skilled volunteers and tech-for-good events"
        />
        <div className="FindEventsController-root">
          <SplashScreen className="FindEventsController-topsplash" header={"Find Events Title Goes Here"} img={HeroImage.FindEvents} />
          <div className="container">
            <div className="row">
              <EventCardsContainer showSearchControls={true}/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

export default FindEventsController;
