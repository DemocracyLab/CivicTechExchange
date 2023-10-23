import React from "react";
import { Line } from "react-chartjs-2"; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const data = {
  labels: ["2019", "2020", "2021", "2022", "2023*"], // TODO
  datasets: [
    {
      label: "Number of volunteers joined every year",
      data: [300, 600, 1020, 1250, 1670], // TODO
      fill: false,
      borderColor: "#F79E02",
      tension: 0.5,
      pointBackgroundColor: "#F79E02"
    },
    {
      label: "Number of volunteers renewed every year",
      data: [120, 380, 620, 820, 1150], // TODO
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
        text: "2023* - Projected values based on volunteer activity recorded till date.",
      }
    }
  },
  scales: {
    y: {
      ticks: {
        count: 5,
      }
    }
  }
};

type Props = {|
|};

type State = {|
|};

class VolunteerExperience extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Volunteer Experience</h2>
        <div className="volunteer-experience-summary">
          <div className="card-number">
            <span>87%</span>
            <h4>Volunteers renewed</h4>
          </div>
          <div className="card-text">
            <span>We provide a smooth application process for our volunteers, and our platform also hosts
              a variety of projects ensuring there is something for everyone. </span>
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

export default VolunteerExperience;
