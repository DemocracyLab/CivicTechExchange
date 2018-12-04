// @flow

import React from 'react';
import VolunteerCard from "./VolunteerCard.jsx";
import {VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import NotificationModal from "../notification/NotificationModal.jsx";
import ConfirmationModal from "../confirmation/ConfirmationModal.jsx";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import FeedbackModal from "../FeedbackModal.jsx";
import metrics from "../../utils/metrics.js";
import CurrentUser from "../../utils/CurrentUser.js";
import _ from 'lodash'

type Props = {|
  +volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +isProjectAdmin: boolean,
  +projectId: string
|};

type RejectVolunteerParams = {|
  rejection_message: string
|};

type DismissVolunteerParams = {|
  dismissal_message: string
|};

type State = {|
  +volunteers: ?Array<VolunteerDetailsAPIData>,
  +showApproveModal: boolean,
  +showRejectModal: boolean,
  +showDismissModal: boolean,
  +volunteerToActUpon: ?VolunteerDetailsAPIData,
  +showApplicationModal: boolean,
  +applicationModalText: string
|};

class VolunteerSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      volunteers:_.cloneDeep(props.volunteers),
      showApproveModal: false,
      showRejectModal: false,
      showDismissModal: false,
      showApplicationModal: false,
      applicationModalText: ""
    };
    this.openApplicationModal = this.openApplicationModal.bind(this);
    this.openApproveModal = this.openApproveModal.bind(this);
    this.openRejectModal = this.openRejectModal.bind(this);
    this.openDismissModal = this.openDismissModal.bind(this);
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }
  
  openApplicationModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showApplicationModal: true,
      applicationModalText: volunteer.application_text
    });
  }
  
  closeApplicationModal(): void {
    this.setState({
      showApplicationModal: false
    });
  }
  
  openApproveModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showApproveModal: true,
      volunteerToActUpon: volunteer
    });
  }
  
  closeApproveModal(approved: boolean):void {
    if(approved) {
      ProjectAPIUtils.post("/volunteer/approve/" + this.state.volunteerToActUpon.application_id + "/",{},() => {
        metrics.logProjectApproveVolunteer(CurrentUser.userID(), this.props.projectId);
        this.state.volunteerToActUpon.isApproved = true;
        this.setState({
          showApproveModal: false
        });
        this.forceUpdate();
      });
    } else {
      this.setState({
        showApproveModal: false
      });
    }
  }
  
  openRejectModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showRejectModal: true,
      volunteerToActUpon: volunteer
    });
  }
  
  closeRejectModal(confirmRejected: boolean, rejectionMessage: string):void {
    if(confirmRejected) {
      const params: RejectVolunteerParams = {rejection_message: rejectionMessage};
      ProjectAPIUtils.post("/volunteer/reject/" + this.state.volunteerToActUpon.application_id + "/",params,() => {
        metrics.logProjectRejectVolunteer(CurrentUser.userID(), this.props.projectId);
        _.remove(this.state.volunteers, (volunteer: VolunteerDetailsAPIData) => volunteer.application_id === this.state.volunteerToActUpon.application_id);
        this.setState({
          showRejectModal: false
        });
        this.forceUpdate();
      });
    } else {
      this.setState({
        showRejectModal: false
      });
    }
  }
  
  openDismissModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showDismissModal: true,
      volunteerToActUpon: volunteer
    });
  }
  
  closeDismissModal(confirmDismissed: boolean, dismissalMessage: string):void {
    if(confirmDismissed) {
      const params: DismissVolunteerParams = {dismissal_message: dismissalMessage};
      ProjectAPIUtils.post("/volunteer/dismiss/" + this.state.volunteerToActUpon.application_id + "/",params,() => {
        metrics.logProjectDismissVolunteer(CurrentUser.userID(), this.props.projectId);
        _.remove(this.state.volunteers, (volunteer: VolunteerDetailsAPIData) => volunteer.application_id === this.state.volunteerToActUpon.application_id);
        this.setState({
          showDismissModal: false
        });
        this.forceUpdate();
      });
    } else {
      this.setState({
        showDismissModal: false
      });
    }
  }
  
  render(): React$Node {
    const approvedAndPendingVolunteers: Array<Array<VolunteerDetailsAPIData>> = _.partition(this.state.volunteers, volunteer => volunteer.isApproved);
    return (
      <div>
        <NotificationModal
          showModal={this.state.showApplicationModal}
          message={this.state.applicationModalText}
          buttonText="Close"
          onClickButton={this.closeApplicationModal.bind(this)}
        />
  
        <ConfirmationModal
          showModal={this.state.showApproveModal}
          message="Do you want to approve this Volunteer joining the project?"
          onSelection={this.closeApproveModal.bind(this)}
        />
  
        <FeedbackModal
          showModal={this.state.showRejectModal}
          headerText="Reject Application"
          messagePrompt="State the reasons you wish to reject this applicant"
          confirmButtonText="Confirm"
          maxCharacterCount={3000}
          requireMessage={true}
          onConfirm={this.closeRejectModal.bind(this)}
        />
  
        <FeedbackModal
          showModal={this.state.showDismissModal}
          headerText="Dismiss Volunteer"
          messagePrompt="State the reasons you wish to dismiss this volunteer"
          confirmButtonText="Confirm"
          maxCharacterCount={3000}
          requireMessage={true}
          onConfirm={this.closeDismissModal.bind(this)}
        />
      
        {this._renderPendingVolunteers(approvedAndPendingVolunteers[1])}
        {this._renderApprovedVolunteers(approvedAndPendingVolunteers[0])}
      </div>
    );
  }
  
  _renderApprovedVolunteers(approvedVolunteers: ?Array<VolunteerDetailsAPIData>): ?React$Node {
    return !_.isEmpty(approvedVolunteers)
      ? this._renderVolunteerSection(approvedVolunteers, "TEAM")
      : null;
  }
  
  _renderPendingVolunteers(pendingVolunteers: ?Array<VolunteerDetailsAPIData>): ?React$Node {
    return this.props.isProjectAdmin &&  !_.isEmpty(pendingVolunteers)
      ? this._renderVolunteerSection(pendingVolunteers, "AWAITING REVIEW")
      : null;
  }
  
  _renderVolunteerSection(volunteers: ?Array<VolunteerDetailsAPIData>, header: string): React$Node {
      return !_.isEmpty(volunteers)
      ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
          <div className='col'>
            <h2 className="form-group subheader">{header}</h2>
            <div className="Text-section">
              {
                volunteers.map((volunteer,i) =>
                  <VolunteerCard
                    key={i}
                    volunteer={volunteer}
                    isProjectAdmin={this.props.isProjectAdmin}
                    onOpenApplication={this.openApplicationModal}
                    onApproveButton={this.openApproveModal}
                    onRejectButton={this.openRejectModal}
                    onDismissButton={this.openDismissModal}
                  />)
              }
            </div>
          </div>
        </div>
      : null;
  }
  
}

export default VolunteerSection;
