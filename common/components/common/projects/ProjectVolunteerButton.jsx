// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import FeedbackModal from "../FeedbackModal.jsx";
import { PositionInfo } from "../../forms/PositionInfo.jsx";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import Section from "../../enums/Section.js";
import metrics from "../../utils/metrics.js";
import url from "../../utils/url.js";
import _ from "lodash";

type LeaveProjectParams = {|
  departure_message: string,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  positionToJoin: ?PositionInfo,
  onVolunteerClick: () => void,
|};
type State = {|
  project: ?ProjectDetailsAPIData,
  isAlreadyVolunteering: boolean,
  showContactModal: boolean,
  showLeaveProjectModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string,
|};

/**
 * Button to open Modal for volunteering to join a project
 */
class ProjectVolunteerButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = this.getButtonDisplaySetup(props);

    this.handleShowJoinModal = this.handleShowJoinModal.bind(this);
    this.handleShowLeaveModal = this.handleShowLeaveModal.bind(this);
  }

  getButtonDisplaySetup(props: Props): State {
    // TODO: Don't show button for user who is already volunteering
    const project = props.project;
    const newState = {
      project: project,
      isAlreadyVolunteering: _.some(
        props.project.project_volunteers,
        (volunteer: VolunteerDetailsAPIData) =>
          volunteer.user.id === CurrentUser.userID()
      ),
      buttonDisabled: false,
      buttonTitle: "",
    };
    if (!CurrentUser.isLoggedIn()) {
      newState.buttonDisabled = false;
      newState.buttonTitle = "Please sign up or log in to volunteer";
    } else if (!CurrentUser.isEmailVerified()) {
      newState.buttonDisabled = true;
      // TODO: Provide mechanism to re-send verification email
      newState.buttonTitle =
        "Please verify your email address before volunteering";
    } else if (!project.project_claimed) {
      newState.buttonDisabled = true;
      newState.buttonTitle =
        "This project has not yet been claimed by its owner";
    }

    return newState;
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }

  handleShowJoinModal() {
    metrics.logVolunteerClickVolunteerButton(
      CurrentUser.userID(),
      this.props.project.project_id
    );
    this.props.onVolunteerClick();
  }

  handleShowLeaveModal() {
    metrics.logVolunteerClickLeaveButton(
      CurrentUser.userID(),
      this.props.project.project_id
    );
    this.setState({ showLeaveProjectModal: true });
  }

  confirmLeaveProject(confirmLeaving: boolean, departureMessage: string): void {
    if (confirmLeaving) {
      const params: LeaveProjectParams = {
        departure_message: departureMessage,
      };
      ProjectAPIUtils.post(
        "/volunteer/leave/" + this.props.project.project_id + "/",
        params,
        () => {
          metrics.logVolunteerClickLeaveConfirm(
            CurrentUser.userID(),
            this.props.project.project_id
          );
          window.location.reload(true);
        }
      );
    } else {
      this.setState({
        showLeaveProjectModal: false,
      });
    }
  }

  render(): ?React$Node {
    if (this.state) {
      if (CurrentUser.isLoggedIn()) {
        if (CurrentUser.userID() !== this.props.project.project_creator) {
          return (
            <div>
              {this._renderVolunteerButton()}
              <FeedbackModal
                showModal={this.state.showLeaveProjectModal}
                headerText="Leave Project"
                messagePrompt="State the reasons you wish to leave this project (Optional)"
                confirmButtonText="Confirm"
                confirmProcessingButtonText="Confirming"
                maxCharacterCount={3000}
                requireMessage={false}
                onSelection={this.confirmLeaveProject.bind(this)}
                onConfirmOperationComplete={() =>
                  this.setState({
                    showLeaveProjectModal: false,
                  })
                }
              />
            </div>
          );
        } else {
          return null;
        }
      } else {
        return <div>{this._renderLinkToSignInButton()}</div>;
      }
    } else {
      return null;
    }
  }

  _renderVolunteerButton(): React$Node {
    if (this.state.isAlreadyVolunteering) {
      // TODO: Make this its own component and hook up to My Projects page
      return (<Button
        className="AboutProject-button"
        type="button"
        variant="destructive"
        onClick={this.handleShowLeaveModal}
      >
        Leave Project
      </Button>);

    } else {
      if (!_.isEmpty(this.props.positions)) {
        return (
          <Button
            variant="primary"
            className="AboutProject-button"
            type="button"
            disabled={this.state.buttonDisabled}
            title={this.state.buttonTitle}
            onClick={this.handleShowJoinModal}
          >
            Volunteer With Project
          </Button>
        );

      }
    }
  }

  _renderLinkToSignInButton(): React$Node {
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.logInThenReturn()}
      >
        Volunteer
      </Button>
    );
  }
}

export default ProjectVolunteerButton;
