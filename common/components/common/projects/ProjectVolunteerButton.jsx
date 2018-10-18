// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ProjectVolunteerModal from "./ProjectVolunteerModal.jsx";

type Props = {|
  project: ?ProjectDetailsAPIData
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  showContactModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string
|};

/**
 * Button to open Modal for volunteering to join a project
 */
class ProjectVolunteerButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    if(props.project) {
      this.state = this.getButtonDisplaySetup(props);
    } else {
      this.state = {
        project: null,
        showContactModal: false,
        buttonDisabled: false,
        buttonTitle: ""
      };
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  getButtonDisplaySetup(props: Props): State {
    // TODO: Don't show button for user who is already volunteering
    const project = props.project;
    const newState = {
      project: project,
      showContactModal: false,
      buttonDisabled: false,
      buttonTitle: ""
    };
    if(!CurrentUser.isLoggedIn()) {
      newState.buttonDisabled = false;
      newState.buttonTitle = "Please sign up or log in to volunteer";
    } else if(!CurrentUser.isEmailVerified()) {
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle = "Please verify your email address before volunteering";
    } else if(!project.project_claimed) {
      newState.buttonDisabled = true;
      newState.buttonTitle = "This project has not yet been claimed by its owner";
    } 
    
    return newState;
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }
  
  handleShow() {
    this.setState({ showContactModal: true });
  }
  
  handleClose() {
    // TODO: Refresh page
    this.setState({ showContactModal: false });
  }

  render(): ?React$Node {
    if(this.state) {
      if(CurrentUser.isLoggedIn()) {
        if(CurrentUser.userID() !== this.props.project.project_creator){
          return (
            <div>
              {this._renderVolunteerButton()}
              <ProjectVolunteerModal
                projectId={this.state.project && this.state.project.project_id}
                showModal={this.state.showContactModal}
                handleClose={this.handleClose}
              />
            </div>
          );       
        }
      } else {
        return (
          <div>
            {this._renderLinkToSignInButton()}
          </div>
        );
      }
    } else {
      return null;
    }
  }

  _renderVolunteerButton(): React$Node {
    return (
      <Button
        className="ProjectSearchBar-submit"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        onClick={this.handleShow}
      >
        Volunteer With Project
      </Button>
    );
  }

  _renderLinkToSignInButton(): React$Node {
    return (
      <Button
        className="ProjectSearchBar-submit"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href="../login"
      >
        Sign in to Volunteer
      </Button>
    );
  }
}

export default ProjectVolunteerButton;