// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import ContactProjectModal from "./ContactProjectModal.jsx";
import metrics from "../../utils/metrics";

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
      buttonDisabled: false,
      buttonTitle: ""
    };
    if(!CurrentUser.isLoggedIn()) {
      newState.buttonDisabled = false;
      newState.buttonTitle = "Please sign up or log in to contact project owner";
    } else if(!CurrentUser.isEmailVerified()) {
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle = "Please verify your email address before contacting project owner";
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
    metrics.logUserClickContactProjectOwner(CurrentUser.userID(), this.props.project.project_id);
    this.setState({ showContactModal: true });
  }
  
  handleClose() {
    this.setState({ showContactModal: false });
  }

  _renderEditProjectButton(): React$Node {
    const id = {'id':this.props.project.project_id};
    return (
        <Button
          className="ProjectSearchBar-submit"
          type="button"
          disabled={this.state.buttonDisabled}
          title={this.state.buttonTitle}
          href={url.section(Section.EditProject, id)}
          bsStyle="info"
        >
          Edit Project
        </Button>
    );
  }

  _renderContactProjectButton(): React$Node {
    return (
      <Button
        className="ProjectSearchBar-submit"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        onClick={this.handleShow}
      >
        Contact Project
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
        Sign in to Contact Project
      </Button>
    );
  }

  displayEditProjectButton(): ?React$Node {
    if (CurrentUser.userID() === this.props.project.project_creator || CurrentUser.isStaff()) {
      return (
      <div>
        {this._renderEditProjectButton()}
      </div>
      );
    }
  }

  displayContactProjectButton(): ?React$Node {
    if (CurrentUser.userID() !== this.props.project.project_creator) {
    return (
      <div>
        {this._renderContactProjectButton()}
        <ContactProjectModal
          projectId={this.state.project && this.state.project.project_id}
          showModal={this.state.showContactModal}
          handleClose={this.handleClose}
        />
      </div>
      );
    }
  }

  render(): ?React$Node {
    if(this.state) {
      if(CurrentUser.isLoggedIn()) {
        return (
        <div>
          {this.displayEditProjectButton()}
          {this.displayContactProjectButton()}
        </div>)
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
}

export default ContactProjectButton;