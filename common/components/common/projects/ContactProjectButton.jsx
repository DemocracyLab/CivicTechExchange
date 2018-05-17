// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import ContactProjectModal from "./ContactProjectModal.jsx";


type Props = {|
  project: ?ProjectDetailsAPIData
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  showContactModal: boolean,
  buttonVisible: boolean,
  buttonDisabled: boolean,
  buttonTitle: string
|};

/**
 * Button to open Modal for sending messages to project owners
 */
class ContactProjectButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    if(props.project) {
      this.state = this.getButtonDisplaySetup(props);
    } else {
      this.state = {
        project: null,
        showContactModal: false,
        buttonVisible: false,
        buttonDisabled: false,
        buttonTitle: ""
      };
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  getButtonDisplaySetup(props: Props): State {
    const project = props.project;
    const newState = {
      project: project,
      showContactModal: false,
      buttonVisible: true,
      buttonDisabled: false,
      buttonTitle: ""
    };
    if(!CurrentUser.isLoggedIn()) {
      newState.buttonVisible = true;
      newState.buttonDisabled = true;
      newState.buttonTitle = "Please sign up or log in to contact project owner";
    } else if(!CurrentUser.isEmailVerified()) {
      newState.buttonVisible = true;
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle = "Please verify your email address before contacting project owner";
    } else if(!project.project_claimed) {
      newState.buttonVisible = true;
      newState.buttonDisabled = true;
      newState.buttonTitle = "This project has not yet been claimed by its owner";
    } else if(CurrentUser.userID() === project.project_creator) {
      // TODO: Consider replacing this button with Edit Project link if the owner is here
      newState.buttonVisible = false;
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
    this.setState({ showContactModal: false });
  }

  render(): ?React$Node {
    if(this.state) {
      if(CurrentUser.isLoggedIn()) {
        return (
          <div>
            {this.state.buttonVisible
              ? <Button
                className="ProjectSearchBar-submit"
                type="button"
                disabled={this.state.buttonDisabled}
                title={this.state.buttonTitle}
                onClick={this.handleShow}
              >
                Contact Project
              </Button>
              : null
            }
            <ContactProjectModal
              projectId={this.state.project && this.state.project.project_id}
              showModal={this.state.showContactModal}
              handleClose={this.handleClose}
            />
          </div>
        );
      } else {
        return (
          <div>
            {this.state.buttonVisible
              ? <Button
                className="ProjectSearchBar-submit"
                type="button"
                disabled={!this.state.buttonDisabled}
                title={this.state.buttonTitle}
                href="../login"
              >
                Sign in to Contact Project
              </Button>
              : null
            }
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

export default ContactProjectButton;