import React from "react";
import { Line } from "react-chartjs-2"; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

type Props = {|
|};

type State = {|
  renewalRate: number,
  renewalNumberList: Array<number>,
  joinedNumberList: Array<number>,
  yearList: Array<string>,
|};


class VolunteerRenewal extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      renewalRate: 0,
      renewalNumberList: [],
      joinedNumberList: [],
      yearList: [],
    };
  }

  componentDidMount() {
    const url_impact: string = "/api/volunteers_history_stats";
    fetch(new Request(url_impact))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          renewalRate: Math.round(getResponse.cumulative_renewal_percentage*100),
          renewalNumberList: getResponse.yearly_stats.map(item => item.renewals),
          joinedNumberList: getResponse.yearly_stats.map(item => item.approved),
          yearList: getResponse.yearly_stats.map((item, i, array) => {
            if (i === array.length - 1) {
              return item.year + '*';
            } else {
              return item.year + '';
            }
          }),
        })
      );
  }

  render(): React$Node {
    const data = {
      labels: this.state.yearList,
      datasets: [
        {
          label: "Number of volunteers joined every year",
          data: this.state.joinedNumberList,
          fill: false,
          borderColor: "#F79E02",
          tension: 0.5,
          pointBackgroundColor: "#F79E02"
        },
        {
          label: "Number of volunteers renewed every year",
          data: this.state.renewalNumberList,
          fill: false,
          borderColor: "#FDE2B3",
          tension: 0.5,
          pointBackgroundColor: "#FDE2B3"
        }
      ]
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
        <h2 className="text-center AggregatedDashboard-title">Volunteer Renewal</h2>
        <div className="volunteer-experience-summary">
          <div className="card-number">
            <span>{this.state.renewalRate}%</span>
            <h4>Volunteers renewed</h4>
          </div>
          <div className="card-text">
            <span>We provide a smooth application process for our volunteers, and our platform also hosts
              a variety of projects ensuring there is something for everyone. </span>
          </div>
        </div>

        <div className="volunteer-renewal-chart">
          <div className="volunteer-renewal-line">
            <Line
              data={data}
              options={options}
              redraw={true}
              plugins={[
                {
                  beforeDraw(c) {
                    var legends = c.legend.legendItems;
                    legends[0].fillStyle = "#F79E02";
                    legends[1].fillStyle = "#FDE2B3";
                  }
                }
              ]}
            />
          </div>
        </div>
        <div class="volunteer-renewal-chart-desc">
          <p> {this.state.yearList[this.state.yearList.length-1]} - Projected values based on volunteer activity recorded till date.</p>
        </div>
      </React.Fragment>
    );
  }
}

export default VolunteerRenewal;
