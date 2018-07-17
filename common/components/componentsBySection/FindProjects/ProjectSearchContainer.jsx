// @flow

import ProjectTagContainer from './ProjectTagContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import AlertSignupModal from "./AlertSignupModal.jsx";
import {Button} from 'react-bootstrap';
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
  }
  
  handleCloseAlertSignup() {
    this.setState({showAlertSignupModal: false});
  }
  
  render(): React$Node {
    return (
      <div>
      	<p>
        	Welcome to DemocracyLab! Use the filters and search bar below to find tech-for-good projects in Seattle.
      	</p>
        
        <AlertSignupModal
          searchFilters={this.state.searchFilters}
          showModal={this.state.showAlertSignupModal}
          handleClose={this.handleCloseAlertSignup.bind(this)}
        />
        <Button className="alert-signup" onClick={this.openAlertSignup.bind(this)}>
          <i className="fa fa-bell" aria-hidden="true"></i>
          Sign Up for Alerts
        </Button>
        
        <ProjectSearchBar />
        <ProjectTagContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
