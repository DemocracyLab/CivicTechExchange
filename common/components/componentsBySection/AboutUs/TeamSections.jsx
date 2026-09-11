// @flow

import React from "react";
import type { BioPersonData } from "./BioPersonData.jsx";
import type { TeamAPIData } from "../../utils/ProjectAPIUtils.js";
import BioThumbnail from "./BioThumbnail.jsx";
import BioModal from "./BioModal.jsx";

type Props = {|
  teamResponse: TeamAPIData,
|};

type State = {|
  board_of_directors: ?$ReadOnlyArray<BioPersonData>,
  showBiographyModal: boolean,
  allowModalUnsafeHtml: boolean,
  modalPerson: ?BioPersonData,
  personTitle: string,
|};

class TeamSections extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      board_of_directors: null,
      showBiographyModal: false,
      modalPerson: null,
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
    state.board_of_directors =
      response.board_of_directors && JSON.parse(response.board_of_directors);

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
      </div>
    ) : null;
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
