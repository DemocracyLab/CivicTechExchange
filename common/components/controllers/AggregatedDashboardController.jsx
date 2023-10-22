// @flow

import AggregatedDashboard from "../componentsBySection/Landing/AggregatedDashboard.jsx";
import ReturnOfImpact from "../componentsBySection/AggregatedDashboard/ReturnOfImpact.jsx";
import ImpactInVariousSectors from "../componentsBySection/AggregatedDashboard/ImpactInVariousSectors.jsx";
import VolunteerRoles from "../componentsBySection/AggregatedDashboard/VolunteerRoles.jsx";
import VolunteerExperience from "../componentsBySection/AggregatedDashboard/VolunteerExperience.jsx";
import VolunteerMatching from "../componentsBySection/AggregatedDashboard/VolunteerMatching.jsx";
import Hackathons from "../componentsBySection/AggregatedDashboard/Hackathons.jsx";

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
            <ImpactInVariousSectors />
          </div>
          <div className="Dashboard-section">
            <VolunteerRoles />
          </div>
          <div className="Dashboard-section">
            <VolunteerExperience />
          </div>
          <div className="Dashboard-section">
            <VolunteerMatching />
          </div>
          <div className="Dashboard-section">
            <Hackathons />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AggregatedDashboardController;
