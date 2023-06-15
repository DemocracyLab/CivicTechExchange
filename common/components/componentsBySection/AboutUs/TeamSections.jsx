// @flow

import React from "react";
import _ from "lodash";
import type { BioPersonData } from "./BioPersonData.jsx";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import LoadingMessage from "../../chrome/LoadingMessage.jsx";
import type {
  ProjectDetailsAPIData,
  TeamAPIData,
  VolunteerDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import BioThumbnail from "./BioThumbnail.jsx";
import {
  VolunteerDetailsAPIDataEqualsBioPersonData,
  VolunteerUserDataToBioPersonData,
} from "./BioPersonData.jsx";
import GroupBy from "../../utils/groupBy.js";
import BioModal from "./BioModal.jsx";
import Sort from "../../utils/sort.js";
import array from "../../utils/array.js";
import type {
  Dictionary,
  Transform,
  PartitionSet,
} from "../../types/Generics.jsx";

type Props = {|
  teamResponse: TeamAPIData,
|};

type State = {|
  project: ?ProjectDetailsAPIData,
  board_of_directors: ?$ReadOnlyArray<BioPersonData>,
  project_volunteers: ?{ [key: string]: BioPersonData },
  showBiographyModal: boolean,
  allowModalUnsafeHtml: boolean,
  modalPerson: ?BioPersonData,
  personTitle: string,
|};

type SectionConfig = {|
  title: string,
  sectionRoleCategory: string,
  topRoles: ?$ReadOnlyArray<string>,
|};

const SectionConfigs: $ReadOnlyArray<SectionConfig> = [
  {
    title: "Development",
    sectionRoleCategory: "Software Development",
    topRoles: ["technical-director", "technical-lead"],
  },
  {
    title: "Design",
    sectionRoleCategory: "Design",
    topRoles: ["design-lead", "creative-director"],
  },
  {
    title: "Product Management",
    sectionRoleCategory: "Product Management",
    topRoles: ["product-manager-lead"],
  },
  {
    title: "Marketing",
    sectionRoleCategory: "Marketing",
    topRoles: ["marketing-lead"],
  },
  {
    title: "Salesforce Dev/Admin",
    sectionRoleCategory: "Operations",
    topRoles: ["business-operations-lead"],
  },
  {
    title: "Operations",
    sectionRoleCategory: "Business",
    topRoles: [],
  },
];

const roleNameOverride: Dictionary<string> = {
  "business-operations-lead": "Salesforce Team Lead",
};

class TeamSections extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      project: null,
      board_of_directors: null,
      showBiographyModal: false,
      modalPerson: null,
    };
    this.handleShowBio = this.handleShowBio.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props){
    let state: State = { showModal: nextProps.showModal };
    state = this.loadTeamDetails(state, nextProps.teamResponse);
    return state;
  }

  loadTeamDetails(state: State, response: TeamAPIData): State {
    state.board_of_directors =
      response.board_of_directors && JSON.parse(response.board_of_directors);

    if (response.project) {
      state.project = response.project;
      const activeVolunteers: $ReadOnlyArray<VolunteerDetailsAPIData> = response.project.project_volunteers.filter(
        pv => pv.isApproved
      );
      const sortedVolunteers: $ReadOnlyArray<VolunteerDetailsAPIData> = _.sortBy(
        activeVolunteers,
        ["platform_date_joined"]
      );
      // Remove board members from volunteer list
      const uniqueVolunteers: $ReadOnlyArray<BioPersonData> = _.differenceWith(
        sortedVolunteers,
        state.board_of_directors,
        VolunteerDetailsAPIDataEqualsBioPersonData
      );
      state.project_volunteers = GroupBy.andTransform(
        uniqueVolunteers,
        (pv: VolunteerDetailsAPIData) => pv.roleTag.subcategory,
        (pv: VolunteerDetailsAPIData) => {
          return VolunteerUserDataToBioPersonData(
            pv.user,
            pv.roleTag.display_name,
            pv.roleTag.tag_name,
            roleNameOverride,
            pv.isTeamLeader
          );
        }
      );
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
      allowModalUnsafeHtml: allowModalUnsafeHtml,
    });
  }
  handleClose() {
    this.setState({
      modalPerson: null,
      showBiographyModal: false,
      allowModalUnsafeHtml: false,
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

  _boardOfDirectors(): ?React$Node {
    return this.state.board_of_directors ? (
      <div className="about-us-team col">
        <h2>Board of Directors</h2>
        <div className="about-us-team-card-container about-us-board-container">
          {this._renderBios(this.state.board_of_directors, true)}
        </div>
        <hr />
      </div>
    ) : null;
  }

  _ourTeam(): ?React$Node {
    if (this.state.project) {
      const teamSections: $ReadOnlyArray<?React$Node> = SectionConfigs.filter(
        (sc: SectionConfig) =>
          sc.sectionRoleCategory in this.state.project_volunteers
      ).map((sc: SectionConfig) => this._renderTeamSection(sc));

      return (
        <div className="about-us-team col">
          <h2>Our Team</h2>
          <p className="about-us-team-description">
            We are volunteer engineers, marketers, organizers, strategists,
            designers, project managers, and citizens committed to our vision,
            and driven by our mission. Please visit our{" "}
            <a
              href={url.section(Section.AboutProject, {
                id: this.state.project.project_id,
              })}
            >
              project profile
            </a>{" "}
            to learn how you can get involved!
          </p>
          {array.join(teamSections, <hr />)}
        </div>
      );
    } else {
      return (
        <div className="about-us-team col">
          <LoadingMessage message="Loading our team information..." />
        </div>
      );
    }
  }

  _renderTeamSection(sectionConfig: SectionConfig): ?React$Node {
    if (sectionConfig.sectionRoleCategory in this.state.project_volunteers) {
      const team: $ReadOnlyArray<BioPersonData> = this.state.project_volunteers[
        sectionConfig.sectionRoleCategory
      ];

      const sortFunc: Transform<$ReadOnlyArray<BioPersonData>> = (
        team: $ReadOnlyArray<BioPersonData>
      ) =>
        Sort.byNamedEntries(
          team,
          sectionConfig.topRoles,
          (p: BioPersonData) => p.title_tag
        );

      // Divide the team into leads and not, sort both groups by position title, and then recombine for final sorted order
      const leadsAndRestOfTeam: PartitionSet<
        $ReadOnlyArray<BioPersonData>
      > = _.partition(team, (p: BioPersonData) => p.isTeamLeader);
      const leads: $ReadOnlyArray<BioPersonData> = sortFunc(
        leadsAndRestOfTeam[0]
      );
      const rest: $ReadOnlyArray<BioPersonData> = sortFunc(
        leadsAndRestOfTeam[1]
      );
      const sortedTeam: $ReadOnlyArray<BioPersonData> = leads.concat(rest);

      return (
        <React.Fragment>
          <h4>{sectionConfig.title}</h4>
          <div className="about-us-team-card-container">
            {this._renderBios(sortedTeam, false)}
          </div>
        </React.Fragment>
      );
    }
  }

  _renderBioModal(): ?React$Node {
    return (
      <BioModal
        size="lg"
        showModal={this.state.showBiographyModal}
        allowUnsafeHtml={this.state.allowModalUnsafeHtml}
        handleClose={this.handleClose}
        person={this.state.modalPerson}
      />
    );
  }

  _renderBios(
    volunteers: $ReadOnlyArray<BioPersonData>,
    allowUnsafeHtml: boolean
  ): ?React$Node {
    return volunteers.map((volunteer, i) => {
      return (
        <BioThumbnail
          key={i}
          person={volunteer}
          handleClick={this.handleShowBio.bind(this, allowUnsafeHtml)}
        />
      );
    });
  }
}

export default TeamSections;
