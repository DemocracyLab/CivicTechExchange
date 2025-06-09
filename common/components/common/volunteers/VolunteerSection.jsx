// @flow

import React from "react";
import VolunteerCard from "./VolunteerCard.jsx";
import {
  APIResponse,
  VolunteerDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import NotificationModal from "../notification/NotificationModal.jsx";
import ConfirmationModal from "../confirmation/ConfirmationModal.jsx";
import ContactModal from "../projects/ContactModal.jsx";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import FeedbackModal from "../FeedbackModal.jsx";
import metrics from "../../utils/metrics.js";
import CurrentUser from "../../utils/CurrentUser.js";
import promiseHelper from "../../utils/promise.js";
import _ from "lodash";

const CoOwnerHeading = "CO-OWNERS";

type Props = {|
  +volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +isProjectAdmin: boolean,
  +isProjectCoOwner: boolean,
  +projectId: string,
  +renderOnlyPending: boolean,
  +onUpdateVolunteers: ($ReadOnlyArray<VolunteerDetailsAPIData>) => void,
|};

type RejectVolunteerParams = {|
  rejection_message: string,
|};

type DismissVolunteerParams = {|
  dismissal_message: string,
|};

type DemoteVolunteerParams = {|
  demotion_message: string,
|};

type State = {|
  +volunteers: ?Array<VolunteerDetailsAPIData>,
  +showApproveModal: boolean,
  +showRejectModal: boolean,
  +showDismissModal: boolean,
  +volunteerToActUpon: ?VolunteerDetailsAPIData,
  +showApplicationModal: boolean,
  +applicationModalText: string,
  +showPromotionModal: boolean,
  +showDemotionModal: boolean,
  +showContactProjectModal: boolean,
|};

class VolunteerSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      volunteers: _.cloneDeep(props.volunteers),
      showApproveModal: false,
      showRejectModal: false,
      showDismissModal: false,
      showApplicationModal: false,
      showPromotionModal: false,
      showDemotionModal: false,
      applicationModalText: "",
      showContactProjectModal: false,
    };
    this.openApplicationModal = this.openApplicationModal.bind(this);
    this.openApproveModal = this.openApproveModal.bind(this);
    this.openRejectModal = this.openRejectModal.bind(this);
    this.openDismissModal = this.openDismissModal.bind(this);
    this.openPromotionModal = this.openPromotionModal.bind(this);
    this.openDemotionModal = this.openDemotionModal.bind(this);
    this.openVolunteerContactModal = this.openVolunteerContactModal.bind(this);
    this.handleVolunteerContactModal = this.handleVolunteerContactModal.bind(
      this
    );
    this.closeVolunteerContactModal = this.closeVolunteerContactModal.bind(
      this
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.volunteers) {
      this.setState({ volunteers: _.cloneDeep(nextProps.volunteers) });
    }
  }

  openApplicationModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showApplicationModal: true,
      applicationModalText: volunteer.application_text,
    });
  }

  closeApplicationModal(): void {
    this.setState({
      showApplicationModal: false,
    });
  }

  openApproveModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showApproveModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  closeApproveModal(approved: boolean): Promise {
    if (approved) {
      return ProjectAPIUtils.post(
        "/volunteer/approve/" +
          this.state.volunteerToActUpon.application_id +
          "/",
        {},
        () => {
          metrics.logProjectApproveVolunteer(
            CurrentUser.userID(),
            this.props.projectId
          );
          this.state.volunteerToActUpon.isApproved = true;
          this.setState({
            showApproveModal: false,
          });
          this.props.onUpdateVolunteers &&
            this.props.onUpdateVolunteers(this.state.volunteers);
          this.forceUpdate();
        }
      );
    } else {
      return promiseHelper.promisify(() =>
        this.setState({
          showApproveModal: false,
        })
      );
    }
  }

  closeModal(modalVariable: string) {
    const stateChange = {};
    stateChange[modalVariable] = false;
    this.setState(stateChange);
  }

  openPromotionModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showPromotionModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  closePromotionModal(promoted: boolean): Promise {
    if (promoted) {
      return ProjectAPIUtils.post(
        "/volunteer/promote/" +
          this.state.volunteerToActUpon.application_id +
          "/",
        {},
        () => {
          metrics.logProjectPromoteVolunteer(
            CurrentUser.userID(),
            this.props.projectId
          );
          this.state.volunteerToActUpon.isCoOwner = true;
          this.setState({
            showPromotionModal: false,
          });
          this.forceUpdate();
        }
      );
    } else {
      return promiseHelper.promisify(() =>
        this.setState({
          showPromotionModal: false,
        })
      );
    }
  }

  openRejectModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showRejectModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  closeRejectModal(confirmRejected: boolean, rejectionMessage: string): void {
    if (confirmRejected) {
      const params: RejectVolunteerParams = {
        rejection_message: rejectionMessage,
      };
      return ProjectAPIUtils.post(
        "/volunteer/reject/" +
          this.state.volunteerToActUpon.application_id +
          "/",
        params,
        () => {
          metrics.logProjectRejectVolunteer(
            CurrentUser.userID(),
            this.props.projectId
          );
          _.remove(
            this.state.volunteers,
            (volunteer: VolunteerDetailsAPIData) =>
              volunteer.application_id ===
              this.state.volunteerToActUpon.application_id
          );
          this.setState({
            showRejectModal: false,
          });
          this.forceUpdate();
        }
      );
    } else {
      this.setState({
        showRejectModal: false,
      });
    }
  }

  openDismissModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showDismissModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  openVolunteerContactModal(volunteer: VolunteerDetailsAPIData) {
    this.setState({
      showContactProjectModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  closeVolunteerContactModal() {
    this.setState({
      showContactProjectModal: false,
    });
  }

  handleVolunteerContactModal(formFields, closeModal): void {
    ProjectAPIUtils.post(
      "/contact/volunteer/" +
        this.state.volunteerToActUpon.application_id +
        "/",
      formFields,
      closeModal, //Send function to close modal
      response => null /* TODO: Report error to user */
    );
  }

  closeDismissModal(confirmDismissed: boolean, dismissalMessage: string): void {
    if (confirmDismissed) {
      const params: DismissVolunteerParams = {
        dismissal_message: dismissalMessage,
      };
      return ProjectAPIUtils.post(
        "/volunteer/dismiss/" +
          this.state.volunteerToActUpon.application_id +
          "/",
        params,
        () => {
          metrics.logProjectDismissVolunteer(
            CurrentUser.userID(),
            this.props.projectId
          );
          _.remove(
            this.state.volunteers,
            (volunteer: VolunteerDetailsAPIData) =>
              volunteer.application_id ===
              this.state.volunteerToActUpon.application_id
          );
          this.setState({
            showDismissModal: false,
          });
          this.forceUpdate();
        }
      );
    } else {
      this.setState({
        showDismissModal: false,
      });
    }
  }

  openDemotionModal(volunteer: VolunteerDetailsAPIData): void {
    this.setState({
      showDemotionModal: true,
      volunteerToActUpon: volunteer,
    });
  }

  closeDemotionModal(confirmDemoted: boolean, demotionMessage: string): void {
    if (confirmDemoted) {
      const params: DemoteVolunteerParams = {
        demotion_message: demotionMessage,
      };
      return ProjectAPIUtils.post(
        "/volunteer/demote/" +
          this.state.volunteerToActUpon.application_id +
          "/",
        params,
        () => {
          const volunteer = this.state.volunteers.find(
            volunteer =>
              volunteer.application_id ===
              this.state.volunteerToActUpon.application_id
          );
          volunteer.isCoOwner = false;
          this.setState({
            showDemotionModal: false,
          });
          this.forceUpdate();
        }
      );
    } else {
      this.setState({
        showDemotionModal: false,
      });
    }
  }

  render(): React$Node {
    const approvedAndPendingVolunteers: Array<
      Array<VolunteerDetailsAPIData>
    > = _.partition(
      this.state.volunteers.filter(volunteer => !volunteer.isCoOwner),
      volunteer => volunteer.isApproved
    );
    const coOwnerVolunteers: Array<VolunteerDetailsAPIData> = _.filter(
      this.state.volunteers,
      volunteer => volunteer.isCoOwner
    );
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
          onConfirmOperationComplete={this.closeModal.bind(
            this,
            "showApproveModal"
          )}
        />

        <ConfirmationModal
          showModal={this.state.showPromotionModal}
          message="Do you want to promote this Volunteer to Project Co-Owner?"
          onSelection={this.closePromotionModal.bind(this)}
          onConfirmOperationComplete={this.closeModal.bind(
            this,
            "showPromotionModal"
          )}
        />

        <FeedbackModal
          showModal={this.state.showRejectModal}
          headerText="Reject Application"
          messagePrompt="State the reasons you wish to reject this applicant"
          confirmButtonText="Confirm"
          confirmProcessingButtonText="Confirming"
          maxCharacterCount={3000}
          requireMessage={true}
          onSelection={this.closeRejectModal.bind(this)}
          onConfirmOperationComplete={this.closeModal.bind(
            this,
            "showRejectModal"
          )}
        />

        <FeedbackModal
          showModal={this.state.showDismissModal}
          headerText="Dismiss Volunteer"
          messagePrompt="State the reasons you wish to dismiss this volunteer"
          confirmButtonText="Confirm"
          confirmProcessingButtonText="Confirming"
          maxCharacterCount={3000}
          requireMessage={true}
          onSelection={this.closeDismissModal.bind(this)}
          onConfirmOperationComplete={this.closeModal.bind(
            this,
            "showDismissModal"
          )}
        />

        <FeedbackModal
          showModal={this.state.showDemotionModal}
          headerText="Demote Co-Owner"
          messagePrompt="State the reasons for demoting this co-owner"
          confirmButtonText="Confirm"
          confirmProcessingButtonText="Confirming"
          maxCharacterCount={3000}
          requireMessage={true}
          onSelection={this.closeDemotionModal.bind(this)}
          onConfirmOperationComplete={this.closeModal.bind(
            this,
            "showDemotionModal"
          )}
        />

        <ContactModal
          headerText={
            "Send message to " +
            (this.state.volunteerToActUpon
              ? this.state.volunteerToActUpon.user.first_name +
                " " +
                this.state.volunteerToActUpon.user.last_name
              : "")
          }
          explanationText={
            "Volunteer can reply to your message via your registered email."
          }
          showSubject={true}
          showModal={this.state.showContactProjectModal}
          handleSubmission={this.handleVolunteerContactModal}
          handleClose={this.closeVolunteerContactModal}
        />

        {this.props.renderOnlyPending &&
          this._renderPendingVolunteers(approvedAndPendingVolunteers[1])}
        {!this.props.renderOnlyPending &&
          this._renderCoOwnerVolunteers(coOwnerVolunteers)}
        {!this.props.renderOnlyPending &&
          this._renderApprovedVolunteers(approvedAndPendingVolunteers[0])}
      </div>
    );
  }

  _renderCoOwnerVolunteers(
    coOwnerVolunteers: ?Array<VolunteerDetailsAPIData>
  ): ?React$Node {
    return !_.isEmpty(coOwnerVolunteers)
      ? this._renderVolunteerSection(coOwnerVolunteers, "")
      : null;
  }

  _renderApprovedVolunteers(
    approvedVolunteers: ?Array<VolunteerDetailsAPIData>
  ): ?React$Node {
    return !_.isEmpty(approvedVolunteers)
      ? this._renderVolunteerSection(approvedVolunteers, "")
      : null;
  }

  _renderPendingVolunteers(
    pendingVolunteers: ?Array<VolunteerDetailsAPIData>
  ): ?React$Node {
    return (this.props.isProjectAdmin || this.props.isProjectCoOwner) &&
      !_.isEmpty(pendingVolunteers)
      ? this._renderVolunteerSection(
          pendingVolunteers,
          "Review Volunteer Applicants"
        )
      : null;
  }

  _renderVolunteerSection(
    volunteers: ?Array<VolunteerDetailsAPIData>,
    header: string
  ): React$Node {
    return !_.isEmpty(volunteers) ? (
      <div className="Text-section VolunteerSection-volunteerList">
        {header && <h4>{header}</h4>}
        {volunteers.map((volunteer, i) => (
          <VolunteerCard
            key={i}
            volunteer={volunteer}
            isProjectAdmin={this.props.isProjectAdmin}
            isProjectCoOwner={
              this.props.isProjectCoOwner && !(header === CoOwnerHeading)
            } //Co-owners can't edit CO-OWNERS
            onOpenApplication={this.openApplicationModal}
            onApproveButton={this.openApproveModal}
            onRejectButton={this.openRejectModal}
            onDismissButton={this.openDismissModal}
            onPromotionButton={this.openPromotionModal}
            onDemotionButton={this.openDemotionModal}
            onContactButton={this.openVolunteerContactModal}
          />
        ))}
      </div>
    ) : null;
  }
}

export default VolunteerSection;
