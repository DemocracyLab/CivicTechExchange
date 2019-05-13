// @flow

import React from 'react';
import _ from 'lodash'
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import cdn, {Images} from '../utils/cdn.js';
import Headers from "../common/Headers.jsx";
import Person from '@material-ui/icons/Person';
import BioModal from "../componentsBySection/AboutUs/BioModal.jsx";

type State = {|
  aboutUs: ?ProjectDetailsAPIData,
  showBiograhpyModal: boolean
|};

class AboutUsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      aboutUs: null,
      projectId: parseInt(window.DLAB_PROJECT_ID),
      showBiographyModal: false
    }
  }
//componentDidMount and loadProjectDetails copied from AboutProjectController, since we're retrieving a project's information the same way
//in this case we use the value provided as an env key to get DemocracyLab's project info, to use in the Our Team section

  componentDidMount() {
    ProjectAPIUtils.fetchProjectDetails(this.state.projectId, this.loadProjectDetails.bind(this));
  }

  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      aboutUs: project,
    });
  }

  _ourMission() {
    return (
      <div className="about-us-mission"
      style={cdn.bgImage('OurMissionBGoverlay.jpg')}>
        <div className="about-us-content">
          <h1>Mission</h1>
          <p>Empower a community of people and projects that use technology to advance the public good.</p>
        </div>
      </div>
    )
  }
  _ourVision() {
    return (
      <div className="about-us-vision"
      style={cdn.bgImage('OurVisionBGoverlay.jpg')}>
        <div className="about-us-content">
          <h2>Vision</h2>
          <p>Technology enables our collective intelligence to solve the most challenging social, economic, environmental and civic problems while empowering all members of our societies.</p>
        </div>
      </div>
    )
  }

  _ourValues() {
    return (
      <div className="row ml-0 mr-0 about-us-values">
        <div className="col-12 col-md-6 about-us-values-core">
          <h2>Core Values</h2>
          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("CommunityIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Community Built</h3>
              <p>We are building for the community, by the community.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("InclusivityIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Inclusivity</h3>
              <p>We believe everyone has something to contribute to the solutions society needs.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("CollaborationIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Collaboration</h3>
              <p>Diverse teams working together with goodwill and respect can accomplish great things.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("EncourageTransparencyIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Transparency</h3>
              <p>Openness promotes learning and builds trust.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("InnovateIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Innovation</h3>
              <p>We encourage experimentation and shared learning to accelerate innovation.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("ChallengeIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Challenge</h3>
              <p>We believe the hard questions are the best questions, and we welcome the challenge to better ourselves and our products.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 about-us-values-image">
          <img src={cdn.image("CoreValuesBG520.jpg")}></img>
        </div>

      </div>
    )
  }
  _problemSolution() {
    return (
      <div className="row ml-0 mr-0 about-us-ps">
        <hr/>
        <div className="about-us-show-md-up col-12 col-md-6 about-us-ps-image">
          <img src={cdn.image("PuzzleBG.jpg")}></img>
        </div>
        <div className="col-12 col-md-6">
          <div className="about-us-ps-icon">
            <img src={cdn.image("QuestionIcon.png")}></img>
          </div>
          <div className="about-us-ps-problem">
          <h2>Problem</h2>
            <p>Everyday people generate powerful ideas that can change the world. Most of these ideas never achieve their potential because of a lack of resources and support.</p>
          </div>
          <div className="about-us-show-sm-down col-12 col-md-6 about-us-ps-image">
            <img src={cdn.image("PuzzleBG.jpg")}></img>
          </div>
          <div className="about-us-ps-solution">
          <h2>Solution</h2>
            <p>
              DemocracyLab helps tech for good projects launch by connecting skilled volunteers to projects that need them. We are open to projects from individuals, community organizations, non-profits, social purpose companies and government agencies. Our platform helps volunteers give back and develop new skills, while accelerating the evolution of new technologies that empower citizens and help institutions become more accessible, accountable, and efficient.
            </p>
          </div>
        </div>
      </div>
    )
  }
  _ourTeam() {
    return (this.state.aboutUs ?
      <div className="about-us-team col">
        <h2>Our Team</h2>
        <p className="about-us-team-description">We are engineers, marketers, organizers, strategists, designers, project managers, and citizens committed to our vision, and driven by our mission.</p>
        <h4>Business & Marketing Research</h4>
        <div className="about-us-team-card-container">
          {this._renderTeamOwners(this.state.aboutUs.project_owners)}
          {this._filterTeamSection(this.state.aboutUs.project_volunteers, 'Business')}
        </div>
        <hr />
        <h4>Design</h4>
        <div className="about-us-team-card-container">
          {this._filterTeamSection(this.state.aboutUs.project_volunteers, 'Design')}
        </div>
        <hr />
        <h4>Development</h4>
        <div className="about-us-team-card-container">
          {this._filterTeamSection(this.state.aboutUs.project_volunteers, 'Software Development')}
        </div>
      </div> : <div className="about-us-team col"><p>Loading our team information...</p></div>)
  }

  _renderTeamOwners(owners) {
    //TODO: see if we can clean up nested returns, should probably be extracted to a component
      return(
        owners.map((owner, i) => {
        return (
          <div className="about-us-team-card" key={i}>
            <a href={"/index/?section=Profile&id=" + owner.id} className="about-us-team-card-link">
              {this._renderAvatar(owner)}
              <div className="about-us-team-card-title">
                <p className="about-us-team-card-name">{owner.first_name} {owner.last_name}</p>
                <p>Project Owner</p>
              </div>
            </a>
          </div>
          )}
          )
        )
  }

  _filterTeamSection(volunteers, role) {
    let filtered = volunteers.filter(vo => vo.roleTag.subcategory === role);
    return this._renderTeamVolunteers(filtered);
  }


  _renderTeamVolunteers(volunteers) {
    return(
      volunteers.map((vo, i) => {
      return vo.isApproved && (
        <div className="about-us-team-card" key={i}>
          <a href={"/index/?section=Profile&id=" + vo.user.id} className="about-us-team-card-link">
            {this._renderAvatar(vo.user)}
            <div className="about-us-team-card-title">
              <p className="about-us-team-card-name">{vo.user.first_name} {vo.user.last_name}</p>
              <p>{vo.roleTag.display_name}</p>
            </div>
          </a>
        </div>
    )}
    )
  )
  }

  _volunteerWithUs() {
    return (
      <div className="about-us-volunteer col">
        <div className="row">
          <div className="col-sm-3">
            <img className="about-us-volunteer-logo" src={cdn.image(Images.DL_GLYPH)}></img>
          </div>
          <div className="col-xs-12 col-sm-9">
            <h2>Volunteer</h2>
            <p>We connect skilled volunteers with the projects that need them. Open to everyone from individuals and established nonprofits to government organizations and for-profit social enterprises — we provide an open avenue for a better connection, more efficient collaboration, and increased impact.</p>
            <p className="about-us-volunteer-disclaimer">DemocracyLab is a volunteer-based 501(c)3 non-profit organization, headquartered in Seattle, WA.</p>
            <div className="about-us-volunteer-buttons">
              <a href={"/index/?section=AboutProject&id=" + this.state.projectId} className="SubHeader-donate-btn-container"><button className="SubHeader-donate-btn">Join Us</button></a>
              <a href="https://connect.democracylab.org/donatenow" className="SubHeader-donate-btn-container" rel="noopener noreferrer"><button className="SubHeader-log-btns">Donate</button></a>
            </div>
          </div>
        </div>
    </div>
    )
  }

  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | About";
    const description: string = "Learn About democracyLab, the nonprofit connecting skilled individuals to tech-for-good projects."

    return (
      <Headers
        title={title}
        description={description}
      />
    );
  }

   _renderAvatar(person) {
     //modified version of common/components/common/avatar.jsx - to allow for variable sizing via CSS mediaquery instead of provided value as prop
     return (
       person.user_thumbnail
         ? <div className="about-us-team-avatar" style={{backgroundImage: `url(${person.user_thumbnail.publicUrl})`}}></div>
         : (<div className="about-us-team-avatar-default">
             <Person className="PersonIcon"/>
           </div>)
     );
   }


   render(): $React$Node {
     return (
       <div className="container pl-0 pr-0 about-us-root">
         {this._renderHeader()}
         {this._ourMission()}
         {this._ourVision()}
         {this._ourValues()}
         {this._problemSolution()}
         {this._ourTeam()}
         {this._volunteerWithUs()}
       </div>
     )
   }
}

export default AboutUsController;
