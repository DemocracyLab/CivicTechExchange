import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);



type Props = {|
|};

type State = {|
  areaList: Array<string>,
  areaCountList: Array<number>,
  totalAreas: number
|};

class ImpactAcrossSectors extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      areaList: [],
      areaCountList: [],
      totalAreas: 0,
      retryCount: 0,
      maxRetries: 3, // Maximum number of retries
      retryDelay: 1000 // Delay between retries in milliseconds
    };
  }

  componentDidMount() {
    this.fetchProjectIssueAreas();
  }

  fetchProjectIssueAreas = () => {
    const { retryCount, maxRetries, retryDelay } = this.state;
    const url_impact = "/api/impact/project_issue_areas";

    fetch(new Request(url_impact))
      .then(response => {
        if (!response.ok) {
          if (retryCount < maxRetries) {
            setTimeout(() => {
              this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
              this.fetchProjectIssueAreas();
            }, retryDelay);
          }
          throw new Error('Max retries reached. ' + response.statusText);
        }
        return response.json();
      })
      .then(getResponse => {
        this.setState({
          areaList: Object.keys(getResponse),
          areaCountList: Object.values(getResponse),
          totalAreas: Object.keys(getResponse).length,
          retryCount: 0 // Reset retry count on successful fetch
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  render(): React$Node {
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
