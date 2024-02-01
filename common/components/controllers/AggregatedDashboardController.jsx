import React, { useEffect, useState } from "react";
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
    const data_url = "/api/impact_dashboard";
    fetch(new Request(data_url))
      .then(response => {
        if (!response.ok) {
          throw new Error('Impact dashboard request failed. ' + response.statusText);
        }
        return response.json();
      })
      .then(json => setImpactData(json))
      .catch(error => {
        console.error('Impact Data Fetch Error:', error);
        setImpactData(null);
      });
      console.log("impactData: ", impactData);
  }, []);

  return (
    <div className="Dashboard-summary">
      <AggregatedDashboard impactData={impactData} />
    </div>
  );

  // return (
  //   <div className="Dashboard-summary">
  //     <AggregatedDashboard impactData={impactData} />
  //   </div>
  // );
}

// class AggregatedDashboardController extends React.PureComponent {
//   constructor(): void {
//     super();
//     this.state = {
//         volunteerStats: null,
//         retryCount: 0,
//         maxRetries: 3,  // Maximum number of retries
//         retryDelay: 1000 // Delay between retries in milliseconds
//     };
//   }

//   componentDidMount(): void {
//     document.getElementById('detailButton').style.display = 'none';
//     document.getElementById('dashboardDisplay').style.marginTop = '80px';
//     this.fetchVolunteerStats();
//   }

//   fetchVolunteerStats() {
//     const { retryCount, maxRetries, retryDelay } = this.state;
//     const url_impact: string = "/api/impact/volunteers_history_stats";

//     fetch(new Request(url_impact))
//       .then(response => {
//         if (!response.ok) {
//           if (retryCount < maxRetries) {
//             // Retry after a delay
//             setTimeout(() => {
//               this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
//               this.fetchVolunteerStats();
//             }, retryDelay);
//           }
//           throw new Error('Max retries reached. ' + response.statusText);

//         }
//         return response.json();
//       })
//       .then(data => this.setState({ volunteerStats: data, retryCount: 0 }))
//       .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//         this.setState({ volunteerStats: null });
//       });
//   }

//   render(): React$Node {
//     const { volunteerStats } = this.state;
//     return (
//       <React.Fragment>
//         <div className="Dashboard-summary">
//           <AggregatedDashboard />
//         </div>
//         <div className="Dashboard-detail">
//           <div className="Dashboard-section">
//             <ReturnOfImpact />
//           </div>
//           <div className="Dashboard-section">
//             <ImpactAcrossSectors />
//           </div>
//           <div className="Dashboard-section">
//             <VolunteerRoles />
//           </div>
//           {volunteerStats && (
//           <React.Fragment>
//             <div className="Dashboard-section">
//               <VolunteerMatching data={volunteerStats} />
//             </div>
//             <div className="Dashboard-section">
//               <VolunteerRenewal data={volunteerStats} />
//             </div>
//           </React.Fragment>
//           )}
//           <div className="Dashboard-section">
//             <Hackathons />
//           </div>
//         </div>
//         <SponsorFooter forceShow={true}/>
//       </React.Fragment>
//     );
//   }
// }

// export default AggregatedDashboardController;
