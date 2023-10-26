// @flow

import AggregatedDashboard from "../componentsBySection/Landing/AggregatedDashboard.jsx";
import ReturnOfImpact from "../componentsBySection/AggregatedDashboard/ReturnOfImpact.jsx";
import ImpactAcrossSectors from "../componentsBySection/AggregatedDashboard/ImpactAcrossSectors.jsx";
import VolunteerRoles from "../componentsBySection/AggregatedDashboard/VolunteerRoles.jsx";
import VolunteerRenewal from "../componentsBySection/AggregatedDashboard/VolunteerRenewal.jsx";
import VolunteerMatching from "../componentsBySection/AggregatedDashboard/VolunteerMatching.jsx";
import Hackathons from "../componentsBySection/AggregatedDashboard/Hackathons.jsx";
import SponsorFooter from "../chrome/SponsorFooter.jsx";

import urls from "../utils/url.js";
import React from "react";

class AggregatedDashboardController extends React.PureComponent {
  constructor(): void {
    super();
    this.state = {};
  }

  componentDidMount(): void {
    document.getElementById('detailButton').style.display = 'none';
    document.getElementById('dashboardDisplay').style.marginTop = '80px';
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="Dashboard-summary">
          <AggregatedDashboard />
        </div>
        <div className="Dashboard-detail">
          <div className="Dashboard-section">
            <ReturnOfImpact />
          </div>
          <div className="Dashboard-section">
            <ImpactAcrossSectors />
          </div>
          <div className="Dashboard-section">
            <VolunteerRoles />
          </div>
          <div className="Dashboard-section">
            <VolunteerRenewal />
          </div>
          <div className="Dashboard-section">
            <VolunteerMatching />
          </div>
          <div className="Dashboard-section">
            <Hackathons />
          </div>
        </div>
        <SponsorFooter forceShow={true}/>
      </React.Fragment>
    );
  }
}

export default AggregatedDashboardController;
