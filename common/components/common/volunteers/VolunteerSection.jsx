// @flow

import React from 'react';
import url from '../../utils/url.js';
import VolunteerCard from "./VolunteerCard.jsx";
import {VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import _ from 'lodash'

type Props = {|
  +volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +isProjectAdmin: boolean
|};

type State = {|
  +volunteers: ?Array<VolunteerDetailsAPIData>
|};

class VolunteerSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {volunteers:_.cloneDeep(props.volunteers)}
    // this.handleShow = this.handleShow.bind(this);
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.getButtonDisplaySetup(nextProps));
  }
  
  render(): React$Node {
    const approvedAndPendingVolunteers = _.partition(this.state.volunteers, volunteer => volunteer.isApproved);
    return (
      <div>
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
                  <VolunteerCard key={i} volunteer={volunteer} isProjectAdmin={this.state.isProjectAdmin}/>)
              }
            </div>
          </div>
        </div>
      : null;
  }
  
}

export default VolunteerSection;
