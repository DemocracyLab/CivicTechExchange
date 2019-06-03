// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import cdn from "../utils/cdn.js";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';


//get press links
const pressLinks = JSON.parse(_.unescape(window.PRESS_LINKS))
//set 'static' stats to merge with API results later
const staticData = {
  platformLaunch: '2018',
  orgFounded: '2006'
}
//set display names based on key names for stats. TODO: move to global?
const categoryDisplayNames = {
  //TODO: move to global constants file
  "platformLaunch": "Platform Launched",
  "orgFounded": "Founded",
  "dlVolunteerCount": "Team Members",
  "activeVolunteerCount": "Active Volunteers",
  "userCount": "Number of Users",
  "projectCount": "Number of Projects"
}

class PressController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      stats: null,
    }
  }

  componentDidMount() {
    //get stats from API, callback function will merge with static data defined above, then set state
    ProjectAPIUtils.fetchStatistics(this.setStats.bind(this));
  }

  setStats(dbStats) {
    let combined = Object.assign({}, dbStats, staticData);
    this.setState({
      stats: combined,
    });
  }


  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | News Feed";
    const description: string = "Read external articles and blog posts describing DemocracyLab's work."

    return (
        <Headers
          title={title}
          description={description}
        />
      );
    }

    _renderTitle(): React$Node {
      return (
        <div className="press-title" style={cdn.bgImage('PressBG.jpg')}>
          <div className="press-bounded-content">
            <h1>News Feed</h1>
            <p>For press opportunities, please contact hello@democracylab.org</p>
          </div>
        </div>
      )
    }

    _renderStats(): React$Node {
      return (this.state.stats ?
        <div className="press-stats" style={cdn.bgImage('OurVisionBGoverlay.jpg')}>
          <div className="press-bounded-content press-stats-content">
            {this._renderStatItems(this.state.stats)}
          </div>
       </div> : <div className="press-stats" style={cdn.bgImage('OurVisionBGoverlay.jpg')}>Loading statistics...</div>
     )
    }
    _renderNews(): React$Node {
      return (
        <div className="press-in-news">
        <h2>In the media</h2>
        {pressLinks.map((item, i) => {
          return (
            <div className="press-presslink" key={i}>
              <p>{item.date}</p>
              <h4><a href={item.href} alt={item.source + ' - ' + item.title}>{item.title}</a></h4>
            </div>
          )})}
        </div>
      )
    }

    _renderStatItems(statData) {
      return Object.keys(statData).map(function(key) {
          let name = categoryDisplayNames[key] || key; //have to do this here to avoid API errors that shouldn't happen but do, ok sure whatever react
          return (
            <div className="press-stats-item" key={key}>
              <p className="press-stats-data">{statData[key]}</p>
              <p className="press-stats-label">{name}</p>
            </div>
            )
        })
      }

   render(): $React$Node {
     return (
       <React.Fragment>
         {this._renderHeader()}
         <div className="container-fluid pl-0 pr-0 press-root">
           {this._renderTitle()}
           {this._renderStats()}
         </div>
         <div className="container press-root">
           {this._renderNews()}
         </div>
     </React.Fragment>
     )
   }
}

export default PressController;
