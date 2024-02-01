import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class VolunteerMatching extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchingRate: 0,
      approvedNumberList: [],
      applicationNumberList: [],
      yearList: [],
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      matchingRate: Math.round(data.volunteer_matching*100),
      approvedNumberList: data.yearly_stats.map(item => item.approved),
      applicationNumberList: data.yearly_stats.map(item => item.applications),
      yearList: data.yearly_stats.map(item => item.year),
    })
  }

  render() {
    const data = {
      labels: this.state.yearList,
      datasets: [
        {
          label: 'Number of volunteer applications',
          data: this.state.applicationNumberList,
          backgroundColor: '#F9B135',
        },
        {
          label: 'Number of volunteer approvals',
          data: this.state.approvedNumberList,
          backgroundColor: '#FDE2B3',
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
            count: 5,
            font: {
              family:'Montserrat'
            }
          }
        }
      }
    };

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Volunteer Matching</h2>
        <div className="Volunteer-matching-summary">
          <div className="card-number">
            <span>{this.state.matchingRate}%</span>
            <h4>Volunteer Matched</h4>
          </div>
          <div className="card-text">
            <span>
              Over the years, we have observed consistent growth in both
              the number of volunteers applying and those receiving approval.
            </span>
          </div>
        </div>
        <div className="volunteer-matching-chart">
          <div className="volunteer-matching-bar">
            <Bar
              options={options}
              data={data}
              redraw={true}
              plugins={[
                {
                  beforeDraw(c) {
                    var legends = c.legend.legendItems;
                    legends[0].fillStyle = "#F9B135";
                    legends[1].fillStyle = "#FDE2B3";
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

export default VolunteerMatching;
