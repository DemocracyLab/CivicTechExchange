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
    this.state = {
        volunteerStats: null,
    };
  }

  componentDidMount(): void {
    document.getElementById('detailButton').style.display = 'none';
    document.getElementById('dashboardDisplay').style.marginTop = '80px';
    const url_impact: string = "/api/volunteers_history_stats";
      fetch(new Request(url_impact))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => this.setState({ volunteerStats: data }))
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      this.setState({ volunteerStats: null });
    });
  }

  render(): React$Node {
    const { volunteerStats } = this.state;
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
          {volunteerStats && (
          <React.Fragment>
            <div className="Dashboard-section">
              <VolunteerRenewal data={volunteerStats} />
            </div>
            <div className="Dashboard-section">
              <VolunteerMatching data={volunteerStats} />
            </div>
          </React.Fragment>
        )}
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