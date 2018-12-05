// @flow

import ProjectTagContainer from './ProjectTagContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import AlertSignupModal from "./AlertSignupModal.jsx";
import GlyphStyles from "../../utils/glyphs.js";
import {Button} from 'react-bootstrap';
import metrics from "../../utils/metrics.js";
import React from 'react';

type State = {|
  showAlertSignupModal: boolean,
  searchFilters: ?string
|};

class ProjectSearchContainer extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      showAlertSignupModal: false,
      searchFilters: ""
    };
  }

  openAlertSignup() {
    this.setState({
      showAlertSignupModal: true,
      searchFilters: document.location.search
    });
    metrics.logUserAlertButtonClick();
  }

  handleCloseAlertSignup() {
    this.setState({showAlertSignupModal: false});
  }

  render(): React$Node {
    return (
      <div className="row">
        <div className="IntroText col-12">
        	<p>
          	Welcome to DemocracyLab! Use the filters and search bar below to find volunteer opportunities with tech-for-good projects.
        	</p>
        </div>

        <AlertSignupModal
          searchFilters={this.state.searchFilters}
          showModal={this.state.showAlertSignupModal}
          handleClose={this.handleCloseAlertSignup.bind(this)}
        />
        <Button className="alert-signup" onClick={this.openAlertSignup.bind(this)}>
          <i className={GlyphStyles.Alert} aria-hidden="true"></i>
          Sign Up for Alerts
        </Button>

        <ProjectSearchBar />
        <ProjectTagContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
