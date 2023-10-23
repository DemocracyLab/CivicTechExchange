import React from "react";
import { Line } from "react-chartjs-2"; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const data = {
  labels: ["2018", "2019", "2020", "2021", "2022", "2023"], // TODO
  datasets: [
    {
      label: "Cumulative impact created",
      data: [0, 935099, 2313974, 4402349, 7981224, 12365849], // TODO
      fill: false,
      borderColor: "#F79E02",
      tension: 0.5,
      pointBackgroundColor: "#F79E02"
    },
    {
      label: "Cumulative expenses",
      data: [5165, 12633, 93083, 242878, 282268, 294484], // TODO
      fill: false,
      borderColor: "#FDE2B3",
      tension: 0.5,
      pointBackgroundColor: "#FDE2B3"
    }
  ]
};

const options = {
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
      title: {
        display: true,
        color: "#191919",
        font: {
          family: "Montserrat",
          weight: "normal",
        },
        padding: {
          top: 32,
        },
        text: ["Total expenses calculated between 1 January 2018 and 18 October 2023.","ROI calculated by ((cumulative impact - cumulative expenses)/cumulative expenses)*100."],
      }
    }
  },
  scales: {
    y: {
      ticks: {
        count: 6,
        callback: function(value, index, values) {
          return '$' + value/1000000 + 'M';
        }
      }
    }
  }
};

type Props = {|
|};

type State = {|
|};

class ReturnOfImpact extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Return of Impact</h2>
        <div className="Return-impact-summary">
          <div className="card-number">
            <span>4099%</span>
            <h4>Calculated ROI</h4>
          </div>
          <div className="card-text">
            <span>Since its inception, DemocracyLab has created impact valued at $12,365,849 for various nonprofits and
              tech-for-good projects by connecting them with volunteers. With total expense standing at $294,483.40,
              this has generated 4,099% return of impact for every dollar spent. </span>
          </div>
        </div>

        <div>
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
      </React.Fragment>
    );
  }
}

export default ReturnOfImpact;
