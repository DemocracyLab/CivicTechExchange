import React from "react";
import { Doughnut } from 'react-chartjs-2'; // References: https://react-chartjs-2.js.org/

const data = {
  labels: ['Business', 'Data', 'Design', 'Fundraising', 'Marketing', 'Operations', 'Product', 'Software Development', 'Subject Matter Expert'],
  datasets: [
    {
      data: [13, 5, 2, 6, 8, 7, 10, 9, 6],
      backgroundColor: [
        '#F79E02',
        '#C8BFAF',
        '#DFD3BF',
        '#FDE2B3',
        '#C3A97A',
        '#FAC567',
        '#D19732',
        '#F9B135',
        '#B37508',
      ],
    },
  ],
};

const options = {
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
        padding: 32,
      }
    }
  }
};

type Props = {|
|};

type State = {|
|};

class VolunteerRoles extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Volunteer Roles</h2>
        <div className="volunteer-roles-detail">
          <div className="volunteer-roles-summary">
            <div className="card-number">
              <span>5k+</span>
              <h4>Number of volunteers</h4>
            </div>
            <div className="card-text">
              <span>Each project has a variety of different roles volunteers can choose and apply to, ensuring
                there is something for every volunteer to contribute to and put their skills to use. </span>
            </div>
          </div>
          <div className="volunteer-roles-chart">
            <Doughnut
              data={data}
              options={options}
              redraw={true}
              plugins={[
                {
                  beforeDraw(c) {
                    var legends = c.legend.legendItems;
                    legends[0].fillStyle = "#F79E02";
                    legends[1].fillStyle = "#C8BFAF";
                    legends[2].fillStyle = "#DFD3BF";
                    legends[3].fillStyle = "#FDE2B3";
                    legends[4].fillStyle = "#C3A97A";
                    legends[5].fillStyle = "#FAC567";
                    legends[6].fillStyle = "#D19732";
                    legends[7].fillStyle = "#F9B135";
                    legends[8].fillStyle = "#B37508";
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

export default VolunteerRoles;
