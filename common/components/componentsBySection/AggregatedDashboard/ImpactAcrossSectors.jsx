import React from "react";
import { Bar } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const data = {
  labels: ['Civic Infrastructure', 'No Specific/Other Issue', 'Education', 'Environment', 'Political Reform',
            'Social Justice', 'Health Care', 'Economy', 'Homelessness', 'Public Safety', 'International Issues',
            'Transportation', 'Immigration', 'Cultural Issues', 'Housing Policies', 'National Security', 'Taxes'],
  datasets: [
    {
      label: 'Number of projects in different categories since inception',
      data: [48, 26, 21, 20, 20, 17, 15, 14, 12, 11, 10, 10, 10, 9, 9, 8, 8],
      backgroundColor: '#F9B135',
    },
  ],
};

const options = {
  // responsive: true,
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
        padding: 32,
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
            <span>20+</span>
            <h4>Areas Served</h4>
          </div>
          <div className="card-text">
            <span>
              We host projects from various backgrounds, attracting a wide array of volunteers
              with different skills and capabilities.
            </span>
          </div>
        </div>
        <div>
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
      </React.Fragment>
    );
  }
}

export default ImpactAcrossSectors;
