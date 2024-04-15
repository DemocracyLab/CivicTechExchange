import React from "react";
import { Doughnut } from 'react-chartjs-2';

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
  constructor({ impactData }) {
    super();
    this.state = {
      _impactData: impactData,
      roleList: [],
      roleCountList: [],
      totalVolunteers: 0,
    };
  }

  componentDidMount() {
    this.fetchVolunteerRoles();
  }

  fetchVolunteerRoles() {
    const volunteer_roles = this.state._impactData["volunteer_roles"];
    this.setState({
      roleList: Object.keys(volunteer_roles),
      roleCountList: Object.values(volunteer_roles),
      totalVolunteers: Object.values(volunteer_roles).reduce((sum, curValue) => sum + curValue, 0),
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
