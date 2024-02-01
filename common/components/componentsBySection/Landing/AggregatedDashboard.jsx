import React from "react";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

export default function AggregatedDashboard({impactData}) {
  console.log("impactData prop", impactData);
  const data = impactData;
  const returnOfImpact = data["dollar_impact"].roi;
  const estimatedImpact = data["dollar_impact"].total_impact;
  const activeVolunteerCount = data["overall_stats"].activeVolunteerCount;
  const activeProjectCount = data["overall_stats"].projectCount;
  return (
    <>
      <h2 className="text-center AggregatedDashboard-title">DemocracyLab's Impact</h2>
      <div className="Aggregated-dashboard" id="dashboardDisplay">
          <div className="card card1">
              <span>{Math.round(returnOfImpact*100)}%</span>
              <h4>ROI</h4>
          </div>
          <div className="card card2">
              <span>${Math.round(estimatedImpact/1000000)}M</span>
              <h4>Estimated Impact</h4>
          </div>
          <div className="card card3">
              <span>{activeVolunteerCount}</span>
              <h4>Active Volunteers</h4>
          </div>
          <div className="card card4">
              <span>{activeProjectCount}</span>
              <h4>Active Projects</h4>
          </div>
      </div>
      <Button
          className="text-center AggregatedDashboard-button"
          variant="secondary"
          id="detailButton"
          href={url.section(Section.AggregatedDashboard)}
      >
        View More
      </Button>
    </>
  );
}
