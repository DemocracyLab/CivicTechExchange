// @flow

import _ from "lodash";
import React from "react";
import cdn from "../utils/cdn.js";
import LoadingMessage from "../chrome/LoadingMessage.jsx";

//get press links
const pressLinks = JSON.parse(_.unescape(window.PRESS_LINKS));
//set display names based on key names for stats.
const categoryDisplayNames = {
  dlVolunteerCount: "Team Members",
  activeVolunteerCount: "Active Volunteers",
  userCount: "Registered Users",
  projectCount: "Number of Projects",
};
type statsType = {
  projectCount: number,
  userCount: number,
  activeVolunteerCount: number,
  dlVolunteerCount: number,
};

type State = {|
  stats: statsType,
|};

class PressController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      stats: null,
    };
  }

  _renderTitle(): React$Node {
    return (
      <div className="press-title" style={cdn.bgImage("PressBG.jpg")}>
        <div className="press-bounded-content">
          <h1>News Feed</h1>
          <p>For press opportunities, please contact hello@democracylab.org</p>
        </div>
      </div>
    );
  }

  _renderStats(): React$Node {
    return this.state.stats ? (
      <div
        className="press-stats"
        style={cdn.bgImage("OurVisionBGoverlay.jpg")}
      >
        <div className="press-bounded-content press-stats-content">
          {this._renderStatItems(this.state.stats)}
        </div>
      </div>
    ) : (
      <div
        className="press-stats"
        style={cdn.bgImage("OurVisionBGoverlay.jpg")}
      >
        <LoadingMessage message="Loading statistics..." />
      </div>
    );
  }
  _renderNews(): React$Node {
    return (
      <div className="press-in-news">
        <h2>In the media</h2>
        {pressLinks.map((item, i) => {
          return (
            <div className="press-presslink" key={i}>
              <p>{item.date}</p>
              <p className="press-presslink-source">{item.source}</p>
              <h4>
                <a href={item.href} alt={item.source + " - " + item.title}>
                  {item.title}
                </a>
              </h4>
            </div>
          );
        })}
      </div>
    );
  }

  _renderStatItems(statData) {
    return Object.keys(statData).map(function(key) {
      let name = categoryDisplayNames[key] || key; //have to do this here to avoid API errors that shouldn't happen but do, ok sure whatever react
      return (
        <div className="press-stats-item" key={key}>
          <p className="press-stats-data">{statData[key]}</p>
          <p className="press-stats-label">{name}</p>
        </div>
      );
    });
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        <div className="container-fluid pl-0 pr-0 press-root">
          {this._renderTitle()}
        </div>
        <div className="container press-root">{this._renderNews()}</div>
      </React.Fragment>
    );
  }
}

export default PressController;
