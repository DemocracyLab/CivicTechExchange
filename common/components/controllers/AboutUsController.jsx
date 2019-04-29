// @flow

//TODO: validate all the active imports, these are the result of a messy merge
import React from 'react';
import _ from 'lodash'
// import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
// import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
// import metrics from "../utils/metrics.js";

// type State = {|
//   aboutUs: ?ProjectDetailsAPIData,
// |};

class AboutUsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
    democracyLabID: parseInt(window.DLAB_PROJECT_ID),
    aboutUs: true
    }
  }

  render(): $React$Node {
    return (
      <div className="container">
        <p>hello!</p>
        {this._ourMission()}
        {this._ourVision()}
        {this._ourValues()}
        {this._ourTeam()}
      </div>
    )
  }

  _ourMission() {
    return (<div>Our Mission</div>)
  }
  _ourVision() {
    return (<div>Our Vision</div>)
  }
  _ourValues() {
    return (<div>Our Values</div>)
  }
  _ourTeam() {
    return (this.state.aboutUs ? <div>Our Team</div> : <div>Loading our team information...</div>)
  }
}

export default AboutUsController;
