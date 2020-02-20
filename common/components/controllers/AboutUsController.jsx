// @flow

import React from 'react';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData, TeamAPIData} from '../utils/ProjectAPIUtils.js';
import cdn, {Images} from '../utils/cdn.js';
import Headers from "../common/Headers.jsx";
import BioModal from "../componentsBySection/AboutUs/BioModal.jsx";
import BioThumbnail from "../componentsBySection/AboutUs/BioThumbnail.jsx";
import type {BioPersonData} from "../componentsBySection/AboutUs/BioPersonData.jsx";
import {VolunteerUserDataToBioPersonData, VolunteerDetailsAPIDataEqualsBioPersonData, VolunteerUserDataEqualsBioPersonData} from "../componentsBySection/AboutUs/BioPersonData.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import LoadingMessage from "../chrome/LoadingMessage.jsx";
import prerender from "../utils/prerender.js";
import GroupBy from "../utils/groupBy.js";
import _ from "lodash";
import type {VolunteerDetailsAPIData} from "../utils/ProjectAPIUtils";

type State = {|
  project: ?ProjectDetailsAPIData,
  board_of_directors: ?$ReadOnlyArray<BioPersonData>,
  project_volunteers: ?{ [key: string]: BioPersonData },
  project_owners: ?$ReadOnlyArray<BioPersonData>,
  showBiographyModal: boolean,
  allowModalUnsafeHtml: boolean,
  modalPerson: ?BioPersonData,
  personTitle: string
|};

class AboutUsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      project: null,
      projectId: parseInt(window.DLAB_PROJECT_ID),
      showBiographyModal: false,
      modalPerson: null,
    };
    this.handleShowBio = this.handleShowBio.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
//componentDidMount and loadProjectDetails copied from AboutProjectController, since we're retrieving a project's information the same way
//in this case we use the value provided as an env key to get DemocracyLab's project info, to use in the Our Team section

  componentDidMount() {
    ProjectAPIUtils.fetchTeamDetails(this.loadTeamDetails.bind(this));
  }

  loadTeamDetails(response: TeamAPIData) {
    const state: State = {
      board_of_directors: response.board_of_directors && JSON.parse(response.board_of_directors)
    };
    
    if(response.project) {
      state.project = response.project;
      const sortedVolunteers: $ReadOnlyArray<VolunteerDetailsAPIData> = _.sortBy(response.project.project_volunteers, ["platform_date_joined"]);
      // Remove board members from volunteer list
      const uniqueVolunteers: $ReadOnlyArray<BioPersonData> = _.differenceWith(
        sortedVolunteers,
        state.board_of_directors,
        VolunteerDetailsAPIDataEqualsBioPersonData);
      state.project_volunteers = GroupBy.andTransform(
        uniqueVolunteers,
        (pv) => pv.roleTag.subcategory,
        (pv) => {
          return VolunteerUserDataToBioPersonData(pv.user, pv.roleTag.display_name);
        });
      // Remove board members from owner list
      const uniqueOwners: $ReadOnlyArray<BioPersonData> = _.differenceWith(
        response.project.project_owners,
        state.board_of_directors,
        VolunteerUserDataEqualsBioPersonData);
      state.project_owners = uniqueOwners.map((po) => VolunteerUserDataToBioPersonData(po, "Owner"));
    }
    
    this.setState(state, prerender.ready);
  }

//handlers for biography modal
//show passes information to the modal on whose information to display, close clears that out of state (just in case)
//title is passed separately from the rest because of our data structure for owner and volunteer not matching up
  handleShowBio(allowModalUnsafeHtml: boolean, person: BioPersonData) {
    this.setState({
      modalPerson: person,
      showBiographyModal: true,
      allowModalUnsafeHtml: allowModalUnsafeHtml
    });
  }
  handleClose() {
    this.setState({
      modalPerson: null,
      showBiographyModal: false,
      allowModalUnsafeHtml: false
     });
  }

  _ourMission() {
    return (
      <div className="about-us-mission"
      style={cdn.bgImage('OurMissionBGoverlay.jpg')}>
        <div className="about-us-content container">
          <h1>Mission</h1>
          <p>Empower people who use technology to advance the public good.</p>
        </div>
      </div>
    )
  }
  _ourVision() {
    return (
      <div className="about-us-vision"
      style={cdn.bgImage('OurVisionBGoverlay.jpg')}>
        <div className="about-us-content container">
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
          <img src={cdn.image(Images.CORE_VALUES_BG)}></img>
        </div>

      </div>
    )
  }
  _problemSolution() {
    return (
      <div className="row ml-0 mr-0 about-us-ps">
        <hr/>
        <div className="about-us-show-md-up col-12 col-md-6 about-us-ps-image">
          <img src={cdn.image(Images.PROBLEM_SOLUTION_BG)}></img>
        </div>
        <div className="col-12 col-md-6">
          <div className="about-us-ps-problem">
          <h2>Problem</h2>
            <p>Everyday people generate powerful ideas that can change the world. Most of these ideas never achieve their potential because of a lack of resources and support.</p>
          </div>
          <div className="about-us-show-sm-down col-12 col-md-6 about-us-ps-image">
            <img src={cdn.image(Images.PROBLEM_SOLUTION_BG)}></img>
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
  
  _boardOfDirectors() {
    return (this.state.board_of_directors ?
      <div className="about-us-team col">
        <h2>Board of Directors</h2>
        <div className="about-us-team-card-container">
          {this._renderBios(this.state.board_of_directors, true)}
        </div>
        <hr />
      </div> : null);
  }
  
  _ourTeam() {
    return (this.state.project ?
      <div className="about-us-team col">
        <h2>Our Team</h2>
        <p className="about-us-team-description">We are volunteer engineers, marketers, organizers, strategists, designers, project managers, and citizens committed to our vision, and driven by our mission.</p>
        <h4>Business & Operations</h4>
        <div className="about-us-team-card-container">
          {this._renderBios(this.state.project_owners)}
          {this._filterTeamSection(this.state.project_volunteers, 'Business')}
        </div>
        <hr />
        <h4>Design</h4>
        <div className="about-us-team-card-container">
          {this._filterTeamSection(this.state.project_volunteers, 'Design')}
        </div>
        <hr />
        <h4>Development</h4>
        <div className="about-us-team-card-container">
          {this._filterTeamSection(this.state.project_volunteers, 'Software Development')}
        </div>
      </div> : <div className="about-us-team col"><LoadingMessage message="Loading our team information..." /></div>)
  }

  _filterTeamSection(volunteers, role) {
    return volunteers[role] && this._renderBios(volunteers[role], false);
  }
  
  _renderBios(volunteers: $ReadOnlyArray<BioPersonData>, allowUnsafeHtml: boolean) {
    return (
      volunteers.map((volunteer, i) => {
        return (
          <BioThumbnail key={i} person={volunteer} handleClick={this.handleShowBio.bind(this, allowUnsafeHtml)}/>
        )}
      )
    );
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
              <a href={url.section(Section.Donate)} className="SubHeader-donate-btn-container"><button className="SubHeader-log-btns">Donate</button></a>
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

   _renderBioModal() {
     return <BioModal
      size="lg"
      showModal={this.state.showBiographyModal}
      allowUnsafeHtml={this.state.allowModalUnsafeHtml}
      handleClose={this.handleClose}
      person={this.state.modalPerson}
     />
   }

   render(): $React$Node {
     return (
       <React.Fragment>
         <div className="container-fluid pl-0 pr-0 about-us-root">
           {this._renderHeader()}
           {this._ourMission()}
           {this._ourVision()}
         </div>
         <div className="container pl-0 pr-0 about-us-root">
           {this._ourValues()}
           {this._problemSolution()}
           {this._boardOfDirectors()}
           {this._ourTeam()}
           {this._volunteerWithUs()}
           {this._renderBioModal()}
         </div>
     </React.Fragment>
     )
   }
}

export default AboutUsController;
