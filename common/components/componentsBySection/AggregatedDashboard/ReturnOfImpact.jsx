import React from "react";
import { Line } from "react-chartjs-2"; // References: https://react-chartjs-2.js.org/
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

type HistoryItem = {
  year: string,
  public_value: number,
  expense: number,
};

type Props = {|
|};

type State = {|
  returnOfImpact: number,
  historyData: Array<HistoryItem>,
  totalImpact: number,
  totalExpense: number,
  dateList: Array<string>,
  yearList: Array<string>,
  impactList: Array<number>,
  expenseList: Array<number>,
|};

class ReturnOfImpact extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      returnOfImpact: 0,
      historyData: [],
      dateList: [],
      yearList: [],
      impactList: [],
      expenseList: []
    };
  }

  componentDidMount() {
    const url_impact: string = "/api/impact_data";
    fetch(new Request(url_impact))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          returnOfImpact: Math.round(getResponse.roi*100),
          historyData: getResponse.history,
          totalImpact: getResponse.total_impact,
          totalExpense: getResponse.total_expense,
          dateList: getResponse.history.map(item => item.year),
          yearList: getResponse.history.map(item => item.year.substring(0, 4)),
          impactList: getResponse.history.map(item => item.public_value),
          expenseList: getResponse.history.map(item => item.expense),
        })
      );
  }

  render(): React$Node {
    const data = {
      labels: this.state.yearList,
      datasets: [
        {
          label: "Cumulative impact created",
          data: this.state.impactList,
          fill: false,
          borderColor: "#F79E02",
          tension: 0.5,
          pointBackgroundColor: "#F79E02"
        },
        {
          label: "Cumulative expenses",
          data: this.state.expenseList,
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
            padding: 32
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
            text: [`Total expenses calculated between ${this.state.dateList[0]} and ${this.state.dateList[this.state.dateList.length-1]}.`,"ROI calculated by ((cumulative impact - cumulative expenses)/cumulative expenses)*100."],
          }
        },
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
            count: 6,
            callback: function(value, index, values) {
              return '$' + value/1000000 + 'M';
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
        <h2 className="text-center AggregatedDashboard-title">Return of Impact</h2>
        <div className="Return-impact-summary">
          <div className="card-number">
            <span>{this.state.returnOfImpact}%</span>
            <h4>Calculated ROI</h4>
          </div>
          <div className="card-text">
            <span>Since its inception, DemocracyLab has created impact valued at ${this.state.totalImpact} for various nonprofits and
              tech-for-good projects by connecting them with volunteers. With total expense standing at ${this.state.totalExpense},
              this has generated {this.state.returnOfImpact}% return of impact for every dollar spent. </span>
          </div>
        </div>

        <div className="roi-chart">
          <div className="roi-line">
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
      </React.Fragment>
    );
  }
}

export default ReturnOfImpact;
