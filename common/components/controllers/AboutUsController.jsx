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
      style={this.bgStyle('OurMissionBGoverlay.jpg')}>
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
      style={this.bgStyle('OurVisionBGoverlay.jpg')}>
        <div className="about-us-content">
          <h2>Our Vision</h2>
          <p> At DemocracyLab, we envision a world where everyone who wants to make the world a better place has the [power/ability/opportunity/tools...] to do so.</p>
        </div>
      </div>
    )
  }
  _ourValues() {
    return (
      <div className="row ml-0 mr-0 about-us-values">
        <div className="col-12 col-sm-6 about-us-values-core">
          <h2>Core Values</h2>
          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("CommunityIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Community Built</h3>
              <p>We are building for the community, by the community</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("EncourageTransparencyIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Encourage Transparency</h3>
              <p>Transparency provides opportunities to learn & build trust</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("InnovateIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Always Innovate</h3>
              <p>We are laying the groundwork for innovation in the social sector, by innovating ourselves</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("ChallengeIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Challenge</h3>
              <p>We believe the hard questions are the best questions. We welcome the challenge to better ourselves and our products</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 about-us-values-image">
          <img src={cdn.image("CoreValuesBG.png")}></img>
        </div>

      </div>
    )
  }
  _ourTeam() {
    return (this.state.aboutUs ?
      <div className="about-us-team">
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
