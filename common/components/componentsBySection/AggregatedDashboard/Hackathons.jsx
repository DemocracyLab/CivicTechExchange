import React from "react";

export default function Hackathons({ impactData }) {
  const data = impactData["hackathon_stats"];
  const hackathonCount = data.total_hackathon_count;
  const hackathonParticipants = data.total_hackathon_participants;
  return (
    <>
      <h2 className="text-center AggregatedDashboard-title">Hackathons</h2>
      <div className="hackathon-section">
        <div className="hackathon-card">
          <span>{hackathonCount}</span>
          <h4>Hackathons organized</h4>
        </div>
        <div className="hackathon-card">
          <span>{hackathonParticipants}</span>
          <h4>Hackathon participants</h4>
        </div>
      </div>
      <h4 className="bottom-text">
        Hackathons play a pivotal role in the culture at DemocracyLab. They provide an
        invaluable opportunity for projects to make incremental progress toward their
        long-term goals and have also been instrumental in helping volunteers establish
        enduring relationships with projects that align with their expertise and interests.
      </h4>
    </>
  );
}
