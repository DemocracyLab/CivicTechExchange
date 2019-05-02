// @flow

import React from 'react';
import _ from 'lodash'
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import cdn, {Images} from '../utils/cdn.js';
import Headers from "../common/Headers.jsx";
import Person from '@material-ui/icons/Person';
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
      <div className="about-us-team col">
        <h2>Our Team</h2>
        <p>We are engineers, marketers, organizers, strategists, designers, project managers, and citizens committed to our vision, and driven by our mission.</p>
        <div className="about-us-team-card-container">
        {this._renderTeamOwners(this.state.aboutUs.project_owners)}
        {this._renderTeamVolunteers(this.state.aboutUs.project_volunteers)}
        </div>
      </div> : <div className="about-us-team col"><p>Loading our team information...</p></div>)
  }

  _renderTeamOwners(owners) {
    //TODO: see if we can clean up nested returns, should probably be extracted to a component
    //TODO: get collapsible/expandable user bio ({owner.about_me}) in place
      return(
        owners.map(owner => {
        let bioId = owner.first_name + '-' + owner.last_name;
        return (
          <div className="about-us-team-card" key={bioId}>
          {this._renderAvatar(owner)}
          <p className="about-us-team-card-name">{owner.first_name} {owner.last_name}</p>
          <p>Project Owner</p>
        </div>
      )}
      )
    )
  }

  _renderTeamVolunteers(volunteers) {
    return(
      volunteers.map(vo => {
      let bioId = vo.user.first_name + '-' + vo.user.last_name;
      return vo.isApproved && (
        <div className="about-us-team-card" key={bioId}>
        {this._renderAvatar(vo.user)}
        <p className="about-us-team-card-name">{vo.user.first_name} {vo.user.last_name}</p>
        <p>{vo.roleTag.display_name}</p>
      </div>
    )}
    )
  )
  }

  _volunteerWithUs() {
    return (
      <div className="about-us-volunteer col">
        <h2>Volunteer</h2>
        <div className="row">
          <div className="col-sm-3">
            <img className="about-us-volunteer-logo" src={cdn.image(Images.DL_GLYPH)}></img>
          </div>
          <div className="col-xs-12 col-sm-9">
            <p>We connect skilled volunteers with the projects that need them. Open to everyone from individuals and established nonprofits to government organizations and for-profit social enterprises — we provide an open avenue for a better connection, more efficient collaboration, and increased impact.</p>
            <p className="about-us-volunteer-disclaimer">DemocracyLab is a volunteer-based 501(c)3 non-profit organization, headquartered in Seattle, WA.</p>
            <div className="about-us-volunteer-buttons">
              <a href="mailto:hello@democracylab.org" className="SubHeader-donate-btn-container"><button className="SubHeader-donate-btn">Join Us</button></a>
              <a href="https://connect.democracylab.org/donatenow" className="SubHeader-donate-btn-container" rel="noopener noreferrer"><button className="SubHeader-log-btns">Donate</button></a>
            </div>
          </div>
        </div>
    </div>
    )
  }

  _renderHeader(): React$Node {
    const title: string = "democracyLab | About";
    const description: string = "Learn About democracyLab, the nonprofit connecting skilled individuals to tech-for-good projects."

    return (
      <Headers
        title={title}
        description={description}
      />
    );
  }



  bgStyle(filename) {
    //only set the background image here because it's a CDN link
    let bgImg = cdn.image(filename);
    let style= {
      backgroundImage: `url(${bgImg})`,
     }
    return style;
   }

   _renderAvatar(person) {
     //modified version of common/components/common/avatar.jsx - to allow for variable sizing via CSS mediaquery instead of provided value as prop
     return (
       person.user_thumbnail
         ? <img className="about-us-team-avatar" src={person.user_thumbnail.publicUrl} alt="Profile image"/>
         : (<div className="about-us-team-avatar">
             <Person className="PersonIcon"/>
           </div>)
     );
   }


   render(): $React$Node {
     return (
       <div className="container about-us-root">
         {this._renderHeader()}
         {this._ourMission()}
         {this._ourVision()}
         {this._ourValues()}
         {this._ourTeam()}
         {this._volunteerWithUs()}
       </div>
     )
   }
}

export default AboutUsController;
