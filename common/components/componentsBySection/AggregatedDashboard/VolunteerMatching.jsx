import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

type Props = {|
|};

type State = {|
  matchingRate: number,
  approvedNumberList: Array<number>,
  applicationNumberList: Array<number>,
  yearList: Array<number>,
|};

class VolunteerMatching extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      matchingRate: 0,
      approvedNumberList: [],
      applicationNumberList: [],
      yearList: [],
    };
  }

  componentDidMount() {
    const url_impact: string = "/api/volunteers_history_stats";
    fetch(new Request(url_impact))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          matchingRate: Math.round(getResponse.volunteer_matching*100),
          approvedNumberList: getResponse.yearly_stats.map(item => item.approved),
          applicationNumberList: getResponse.yearly_stats.map(item => item.applications),
          yearList: getResponse.yearly_stats.map(item => item.year),
        })
      );
  }

  render(): React$Node {
    const data = {
      // labels: this.state.yearList,
      labels: ['2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Number of volunteer applications every year',
          // data: this.state.applicationNumberList,
          data: [150, 450, 700, 1100, 1550],
          backgroundColor: '#F9B135',
        },
        {
          label: 'Number of volunteer approvals every year',
          // data: this.state.approvedNumberList,
          data: [50, 200, 350, 700, 850],
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
              The onboarding process is selective, yet ensuring a good response rate
              for a fair portion of total applicants.
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
