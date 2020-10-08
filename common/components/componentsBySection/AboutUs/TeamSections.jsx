// @flow

import React from 'react';
import _ from 'lodash';
import type {BioPersonData} from "./BioPersonData.jsx";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import LoadingMessage from "../../chrome/LoadingMessage.jsx";
import type {ProjectDetailsAPIData, TeamAPIData, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import BioThumbnail from "./BioThumbnail.jsx";
import {
  VolunteerDetailsAPIDataEqualsBioPersonData,
  VolunteerUserDataEqualsBioPersonData,
  VolunteerUserDataToBioPersonData
} from "./BioPersonData.jsx";
import GroupBy from "../../utils/groupBy.js";
import BioModal from "./BioModal.jsx";

type Props = {|
  teamResponse: TeamAPIData
|};

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

class TeamSections extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      project: null,
      board_of_directors: null,
      showBiographyModal: false,
      modalPerson: null
    };
    this.handleShowBio = this.handleShowBio.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    let state: State = { showModal: nextProps.showModal };
    state = this.loadTeamDetails(state, nextProps.teamResponse);
    this.setState(state);
  }
  
  loadTeamDetails(state: State, response: TeamAPIData): State {
    state.board_of_directors = response.board_of_directors && JSON.parse(response.board_of_directors);
    
    if(response.project) {
      state.project = response.project;
      const activeVolunteers: $ReadOnlyArray<VolunteerDetailsAPIData> = response.project.project_volunteers.filter( (pv) => pv.isApproved);
      const sortedVolunteers: $ReadOnlyArray<VolunteerDetailsAPIData> = _.sortBy(activeVolunteers, ["platform_date_joined"]);
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
    
    return state;
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

  render(): ?React$Node {
    return (
      <React.Fragment>
        {this._boardOfDirectors()}
        {this._ourTeam()}
        {this._renderBioModal()}
      </React.Fragment>
    );
  }
  
  _boardOfDirectors() {
    return (this.state.board_of_directors ?
      <div className="about-us-team col">
        <h2>Board of Directors</h2>
        <p className="about-us-team-description">
          Please review our <a href="https://d1agxr2dqkgkuy.cloudfront.net/documents/2019%20DemocracyLab%20Annual%20Report.pdf" >2019 Annual Report</a> to learn about the impact of our programs and platform last year.
        </p>
        <div className="about-us-team-card-container about-us-board-container">
          {this._renderBios(this.state.board_of_directors, true)}
        </div>
        <hr />
      </div> : null);
  }
  
  _ourTeam() {
    return (this.state.project ?
      <div className="about-us-team col">
        <h2>Our Team</h2>
        <p className="about-us-team-description">
          We are volunteer engineers, marketers, organizers, strategists, designers, project managers, and citizens committed to our vision, and driven by our mission.
          Please visit our <a href={url.section(Section.AboutProject, {id: this.state.project.project_id})}>project profile</a> to learn how you can get involved!
        </p>
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
  
  _renderBioModal() {
    return <BioModal
      size="lg"
      showModal={this.state.showBiographyModal}
      allowUnsafeHtml={this.state.allowModalUnsafeHtml}
      handleClose={this.handleClose}
      person={this.state.modalPerson}
    />
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
  
}

export default TeamSections;
