// @flow

import React from 'react';
import _ from 'lodash'
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
// TODO: Create metrics event for this page, then import metrics and use it
// import metrics from "../utils/metrics.js";

type State = {|
  aboutUs: ?ProjectDetailsAPIData,
|};

class AboutUsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      aboutUs: null,
    }
  }
//componentDidMount and loadProjectDetails copied from AboutProjectController, since we're retrieving a project's information the same way
//in this case we use the value provided as an env key to get DemocracyLab's project info, to use in the Our Team section

  componentDidMount() {
    const projectId = parseInt(window.DLAB_PROJECT_ID);
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));
  }

  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      aboutUs: project,
    });
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
