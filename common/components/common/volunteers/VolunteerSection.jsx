// @flow

import React from 'react';
import VolunteerCard from "./VolunteerCard.jsx";
import {VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import NotificationModal from "../notification/NotificationModal.jsx";
import _ from 'lodash'

type Props = {|
  +volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +isProjectAdmin: boolean
|};

type State = {|
  +volunteers: ?Array<VolunteerDetailsAPIData>,
  +showApplicationModal: boolean,
  +applicationModalText: string
|};

class VolunteerSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      volunteers:_.cloneDeep(props.volunteers),
      showApplicationModal: false,
      applicationModalText: ""
    };
  
    this.openApplicationModal = this.openApplicationModal.bind(this);
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }
  
  openApplicationModal(volunteer: VolunteerDetailsAPIData) {
    this.setState({
      showApplicationModal: true,
      applicationModalText: volunteer.application_text
    });
  }
  
  closeApplicationModal() {
    this.setState({
      showApplicationModal: false
    });
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
      
        {this._renderPendingVolunteers(approvedAndPendingVolunteers[1])}
        {this._renderApprovedVolunteers(approvedAndPendingVolunteers[0])}
      </div>
    );
  }
  
  _renderApprovedVolunteers(approvedVolunteers: ?Array<VolunteerDetailsAPIData>): ?React$Node {
    return !_.isEmpty(approvedVolunteers)
      ? this._renderVolunteerSection(approvedVolunteers, "VOLUNTEERS")
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
                    isProjectAdmin={this.state.isProjectAdmin}
                    onOpenApplication={this.openApplicationModal}
                  />)
              }
            </div>
          </div>
        </div>
      : null;
  }
  
}

export default VolunteerSection;
