import React, { useEffect, useState } from "react";
import fetchImpactData from "../utils/impact.js";
import AggregatedDashboard from "../componentsBySection/Landing/AggregatedDashboard.jsx";
import ReturnOfImpact from "../componentsBySection/AggregatedDashboard/ReturnOfImpact.jsx";
import ImpactAcrossSectors from "../componentsBySection/AggregatedDashboard/ImpactAcrossSectors.jsx";
import VolunteerRoles from "../componentsBySection/AggregatedDashboard/VolunteerRoles.jsx";
import VolunteerRenewal from "../componentsBySection/AggregatedDashboard/VolunteerRenewal.jsx";
import VolunteerMatching from "../componentsBySection/AggregatedDashboard/VolunteerMatching.jsx";
import Hackathons from "../componentsBySection/AggregatedDashboard/Hackathons.jsx";
import SponsorFooter from "../chrome/SponsorFooter.jsx";

export default function AggregatedDashboardController() {
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    fetchImpactData().then((data) => setImpactData(data));
  }, []);

  if (!impactData) {
    return null;
  }

  return (
    <>
      <div className="Dashboard-summary">
        <AggregatedDashboard impactData={impactData} />
      </div>
      <div className="Dashboard-detail">
        <div className="Dashboard-section">
          <ReturnOfImpact impactData={impactData} />
        </div>
        <div className="Dashboard-section">
          <ImpactAcrossSectors impactData={impactData} />
        </div>
        <div className="Dashboard-section">
          <VolunteerRoles impactData={impactData} />
        </div>
        {impactData["volunteer_history"] && (
        <>
          <div className="Dashboard-section">
            <VolunteerMatching data={impactData["volunteer_history"]} />
          </div>
          <div className="Dashboard-section">
            <VolunteerRenewal data={impactData["volunteer_history"]} />
          </div>
        </>
        )}
        <div className="Dashboard-section">
          <Hackathons impactData={impactData}/>
        </div>
      </div>
      <SponsorFooter forceShow={true}/>
    </>
  );
}
