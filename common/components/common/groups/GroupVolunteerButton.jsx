// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {GroupDetailsAPIData} from "../../utils/GroupAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import FeedbackModal from "../FeedbackModal.jsx";
import {PositionInfo} from "../../forms/PositionInfo.jsx";
import GroupAPIUtils from "../../utils/GroupAPIUtils.js";
import Section from "../../enums/Section.js";
import metrics from "../../utils/metrics.js";
import url from "../../utils/url.js";
import _ from 'lodash'

type LeaveGroupParams = {|
  departure_message: string
|};

type Props = {|
  group: ?GroupDetailsAPIData,
  positionToJoin: ?PositionInfo,
  onVolunteerClick: () => void
|};
type State = {|
  group: ?GroupDetailsAPIData,
  isAlreadyVolunteering: boolean,
  showContactModal: boolean,
  showLeaveGroupModal: boolean,
  buttonDisabled: boolean,
  buttonTitle: string
|};

/**
 * Button to open Modal for volunteering to join a group
 */
class GroupVolunteerButton extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = this.getButtonDisplaySetup(props);

    this.handleShowJoinModal = this.handleShowJoinModal.bind(this);
    this.handleShowLeaveModal = this.handleShowLeaveModal.bind(this);
  }

  getButtonDisplaySetup(props: Props): State {
    // TODO: Don't show button for user who is already volunteering
    const group = props.group;
    const newState = {
      group: group,
      isAlreadyVolunteering: _.some(props.group.group_volunteers, (volunteer: VolunteerDetailsAPIData) => volunteer.user.id === CurrentUser.userID()),
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
    } else if(!group.group_claimed) {
      newState.buttonDisabled = true;
      newState.buttonTitle = "This group has not yet been claimed by its owner";
    }

    return newState;
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }

  handleShowJoinModal() {
    metrics.logVolunteerClickVolunteerButton(CurrentUser.userID(), this.props.group.group_id);
    this.props.onVolunteerClick();
  }

  handleShowLeaveModal() {
    metrics.logVolunteerClickLeaveButton(CurrentUser.userID(), this.props.group.group_id);
    this.setState({ showLeaveGroupModal: true });
  }

  confirmLeaveGroup(confirmLeaving: boolean, departureMessage: string):void {
    if(confirmLeaving) {
      const params: LeaveGroupParams = {departure_message: departureMessage};
      groupAPIUtils.post("/volunteer/leave/" + this.props.group.group_id + "/",params,() => {
        metrics.logVolunteerClickLeaveConfirm(CurrentUser.userID(), this.props.group.group_id);
        window.location.reload(true);
      });
    } else {
      this.setState({
        showLeaveGroupModal: false
      });
    }
  }

  render(): ?React$Node {
    if(this.state) {
      if(CurrentUser.isLoggedIn()) {
        if(CurrentUser.userID() !== this.props.group.group_creator){
          return (
            <div>
              {this._renderVolunteerButton()}
              <FeedbackModal
                showModal={this.state.showLeaveGroupModal}
                headerText="Leave Group"
                messagePrompt="State the reasons you wish to leave this group (Optional)"
                confirmButtonText="Confirm"
                maxCharacterCount={3000}
                requireMessage={false}
                onConfirm={this.confirmLeavegroup.bind(this)}
              />
            </div>
          );
        } else {
          return null;
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
    return this.state.isAlreadyVolunteering
      ? (
        // TODO: Make this its own component and hook up to My Groups page
        <Button
          className="AboutGroup-button btn btn-theme"
          type="button"
          bsStyle="danger"
          onClick={this.handleShowLeaveModal}
        >
          Leave Group
        </Button>
      )
      : (
        <Button
          className="AboutGroup-button btn btn-theme"
          type="button"
          disabled={this.state.buttonDisabled}
          title={this.state.buttonTitle}
          onClick={this.handleShowJoinModal}
        >
          Volunteer With Group
        </Button>
      );
  }

  _renderLinkToSignInButton(): React$Node {
    return (
      <Button
        className="AboutGroup-button btn btn-theme clear-button-appearance"
        type="button"
        disabled={this.state.buttonDisabled}
        title={this.state.buttonTitle}
        href={url.section(Section.LogIn, url.getPreviousPageArg())}
      >
        Sign in to Volunteer
      </Button>
    );
  }
}

export default GroupVolunteerButton;
