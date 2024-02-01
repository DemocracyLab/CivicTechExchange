import React from "react";
import { Doughnut } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/

const backgroundColorList = [
  '#F79E02',
  '#C8BFAF',
  '#DFD3BF',
  '#FDE2B3',
  '#C3A97A',
  '#FAC567',
  '#D19732',
  '#F9B135',
  '#B37508',
  '#C47002',
];

class VolunteerRoles extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      roleList: [],
      roleCountList: [],
      totalVolunteers: 0,
      retryCount: 0,
      maxRetries: 3, // Maximum number of retries
      retryDelay: 1000 // Delay between retries in milliseconds
    };
  }

  componentDidMount() {
    this.fetchVolunteerRoles();
  }

  fetchVolunteerRoles() {
    const { retryCount, maxRetries, retryDelay } = this.state;
    const url_impact: string = "/api/impact/volunteer_roles";

    fetch(new Request(url_impact))
      .then(response => {
        if (!response.ok) {
          if (retryCount < maxRetries) {
            // Retry after a delay
            setTimeout(() => {
              this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
              this.fetchVolunteerRoles();
            }, retryDelay);
          }
          throw new Error('Max retries reached. ' + response.statusText);
        }
        return response.json();
      })
      .then(getResponse => {
        this.setState({
          roleList: Object.keys(getResponse),
          roleCountList: Object.values(getResponse),
          totalVolunteers: Object.values(getResponse).reduce((sum, curValue) => sum + curValue, 0),
          retryCount: 0 // Reset retry count on successful fetch
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }


  render() {
    const data = {
      labels: this.state.roleList,
      datasets: [
        {
          data: this.state.roleCountList,
          backgroundColor: backgroundColorList.slice(0, this.state.roleList.length),
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        arc: {
            borderWidth: 1
        }
      },
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          align: "start",
          padding: 50,
          labels: {
            usePointStyle: true,
            color: "#191919",
            font: {
              family: "Montserrat",
              weight: "normal",
            },
            padding: 25,
          }
        }
      }
    };

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Volunteer Roles</h2>
        <div className="volunteer-roles-detail">
          <div className="volunteer-roles-summary">
            <div className="card-number">
              <span>{this.state.totalVolunteers}</span>
              <h4>Number of volunteers</h4>
            </div>
            <div className="card-text">
              <span>Volunteers with diverse skills are able to contribute meaningfully
                to projects and gain experience to advance their careers.</span>
            </div>
          </div>
          <div className="volunteer-roles-chart">
            <div className="volunteer-roles-doughnut">
              <Doughnut
                data={data}
                options={options}
                redraw={true}
                plugins={[
                  {
                    beforeDraw(c) {
                      var legends = c.legend.legendItems;
                      for (let i = 0; i < legends.length; i++) {
                        legends[i].fillStyle = backgroundColorList[i % backgroundColorList.length];
                      }
                      // legends[0].fillStyle = "#F79E02";
                      // legends[1].fillStyle = "#C8BFAF";
                      // legends[2].fillStyle = "#DFD3BF";
                      // legends[3].fillStyle = "#FDE2B3";
                      // legends[4].fillStyle = "#C3A97A";
                      // legends[5].fillStyle = "#FAC567";
                      // legends[6].fillStyle = "#D19732";
                      // legends[7].fillStyle = "#F9B135";
                      // legends[8].fillStyle = "#B37508";
                      // legends[9].fillStyle = "#C47002";
                    }
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default VolunteerRoles;
