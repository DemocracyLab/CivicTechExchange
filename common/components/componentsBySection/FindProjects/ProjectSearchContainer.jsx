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
    // TODO: Set search filters
    this.setState({
      showAlertSignupModal: true,
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
          filters={this.state.searchFilters}
          showModal={this.state.showAlertSignupModal}
          handleClose={this.handleCloseAlertSignup.bind(this)}
        />
        <Button onClick={this.openAlertSignup.bind(this)}>Sign Up for Alerts</Button>
        
        
        <ProjectSearchBar />
        <ProjectTagContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
