import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const data = {
  labels: ['Civic Infrastructure', 'Education', 'Other Issue', '1st Amendment', 'Health Care',
            'Environment', '2nd Amendment', 'Economy', 'No Specific Issue', 'Political Reform', 'Social Justice',
            'Homelessness', 'Cultural Issues', 'Public Safety', 'Transportation', 'International Issues',
            'Housing Policies', 'Immigration', 'National Security', 'Taxes'],
  datasets: [
    {
      label: 'Number of projects in different categories since inception',
      data: [124, 90, 62, 50, 47, 44, 43, 39, 35, 26, 24, 18, 18, 15, 9, 8, 7, 4, 4, 1],
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

type Props = {|
|};

type State = {|
|};

class ImpactAcrossSectors extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Impact Across Sectors</h2>
        <div className="Impact-across-sectors-summary">
          <div className="card-number">
            <span>20</span>
            <h4>Areas Served</h4>
          </div>
          <div className="card-text">
            <span>
              We host projects from various backgrounds, attracting a wide array of volunteers
              with different skills and capabilities.
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
