// @flow

import React from 'react';
import _ from 'lodash'
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import cdn from '../utils/cdn.js';
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
      <div className="container about-us-root">
        {this._ourMission()}
        {this._ourVision()}
        {this._ourValues()}
        {this._ourTeam()}
      </div>
    )
  }

//cdn.image("filename.png")
// ChallengeIcon.png
// CommunityIcon.png
// CoreValuesBG.png
// EncourageTransparency.png
// InnovateIcon.png
// OurMissionBG.png
// OurVisionBG.png

  _ourMission() {
    return (
      <div className="about-us-mission"
      style={this.bgStyle('OurMissionBG.png')}>
        <div className="about-us-content">
          <h2>Our Mission</h2>
          <p>We connect people who create technology for public good with talent and resources to achieve their vision</p>
        </div>
      </div>
    )
  }
  _ourVision() {
    return (
      <div className="about-us-vision"
      style={this.bgStyle('OurVisionBG.png')}>
        <div className="about-us-content">
          <h2>Our Vision</h2>
          <p> At DemocracyLab, we envision a world where everyone who wants to make the world a better place has the [power/ability/opportunity/tools...] to do so.</p>
        </div>
      </div>
    )
  }
  _ourValues() {
    return (
      <div className="row about-us-values">
        Our Values
      </div>
    )
  }
  _ourTeam() {
    return (this.state.aboutUs ?
      <div className="row about-us-team">
        Our Team
      </div> : <div>Loading our team information...</div>)
  }

  bgStyle(filename) {
    //only set the background image here because it's a CDN link
    let bgImg = cdn.image(filename);
    let style= {
      backgroundImage: `url(${bgImg})`,
     }
    return style;
   }
}

export default AboutUsController;
