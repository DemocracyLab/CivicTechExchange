// @flow

import Headers from "../common/Headers.jsx";
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import EventCardsContainer from "../componentsBySection/FindEvents/EventCardsContainer.jsx";
import React from 'react';
import type {FindGroupsArgs} from "../stores/GroupSearchStore";
import urls from "../utils/url";
import EventSearchDispatcher from "../stores/EventSearchDispatcher.js";
import _ from "lodash";

class FindEventsController extends React.PureComponent {
  constructor(): void {
    super();
  }
  
  componentWillMount(): void {
    let args: FindGroupsArgs = urls.arguments(document.location.search);
    args = _.pick(args, ['keyword', 'page']);
    EventSearchDispatcher.dispatch({
      type: 'INIT',
      findEventsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true
      }});
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
