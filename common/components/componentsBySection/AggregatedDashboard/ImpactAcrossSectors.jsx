import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class ImpactAcrossSectors extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      areaList: [],
      areaCountList: [],
      totalAreas: 0,
    };
  }

  componentDidMount() {
    this.fetchProjectIssueAreas();
  }

  fetchProjectIssueAreas() {
    const stats = this.props.impactData["hackathon_stats"];
    this.setState({
      areaList: Object.keys(stats),
      areaCountList: Object.values(stats),
      totalAreas: Object.keys(stats).length,
    });
  }

  render() {
    const data = {
      labels: this.state.areaList,
      datasets: [
        {
          label: 'Number of projects in different categories since inception',
          data: this.state.areaCountList,
          backgroundColor: '#F9B135',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          align: "start",
          labels: {
            usePointStyle: true,
            color: "#191919",
            font: {
              family: "Montserrat",
              weight: "normal",
            },
            padding: 25,
          },
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              family:'Montserrat'
            }
          }
        },
        y: {
          ticks: {
            callback: function(tick, index, array) {
              return (index % 2) ? "" : tick;
            },
            font: {
              family:'Montserrat'
            }
          }
        }
      }
    };

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Impact Across Sectors</h2>
        <div className="Impact-across-sectors-summary">
          <div className="card-number">
            <span>{this.state.totalAreas}</span>
            <h4>Areas Served</h4>
          </div>
          <div className="card-text">
            <span>
              We serve projects addressing a wide range of issues.
            </span>
          </div>
        </div>
        <div className="impact-across-sectors-chart">
          <div className="impact-across-sectors-bar">
            <Bar
              options={options}
              data={data}
              redraw={true}
              plugins={[
                {
                  beforeDraw(c) {
                    var legends = c.legend.legendItems;
                    legends[0].fillStyle = "#F9B135";
                  }
                }
              ]}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ImpactAcrossSectors;
