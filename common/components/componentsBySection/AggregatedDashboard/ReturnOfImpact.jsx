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
  startYear: string,
  endDay: string,
  endMonth: string,
  endYear: string,
|};

const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class ReturnOfImpact extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      returnOfImpact: 0,
      historyData: [],
      dateList: [],
      yearList: [],
      impactList: [],
      expenseList: [],
      startYear: '',
      endDay: '',
      endMonth: '',
      endYear: '',
    };
  }

  async componentDidMount() {
    const url_impact = "/api/impact_data";
    const response = await fetch(url_impact);
    const getResponse = await response.json();

    this.setState({
      returnOfImpact: Math.round(getResponse.roi*100),
      historyData: getResponse.history,
      totalImpact: getResponse.total_impact,
      totalExpense: getResponse.total_expense,
      dateList: getResponse.history.map(item => item.quarter_date),
      yearList: getResponse.history.map(item => item.quarter_date.substring(0, 4)),
      impactList: getResponse.history.map(item => item.quarterly_impact),
      expenseList: getResponse.history.map(item => item.expense),
    });

    this.setState({
      startYear: this.state.yearList[0],
      endDay: this.state.dateList[this.state.dateList.length-1].substring(8,10),
      endMonth: monthList[parseInt(this.state.dateList[this.state.dateList.length-1].substring(5,7))-1],
      endYear: this.state.yearList[this.state.yearList.length-1],
    });
  }

  render(): React$Node {
    const data = {
      labels: this.state.yearList,
      datasets: [
        {
          label: "Quarterly impact created",
          data: this.state.impactList,
          fill: false,
          borderColor: "#F79E02",
          tension: 0.5,
          pointBackgroundColor: "#F79E02"
        },
        {
          label: "Quarterly expenses",
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
          align: "start",
          labels: {
            usePointStyle: true,
            color: "#191919",
            font: {
              family: "Montserrat",
              weight: "normal",
            },
            padding: 25
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              family:'Montserrat'
            },
            callback: function(val, index) {
              return (index % 4) ? null : this.getLabelForValue(val);
            },
          }
        },
        y: {
          max: 2000000,
          ticks: {
            count: 5,
            // suggestedMax: 2000000,
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
    let totalImpactConverted = String(this.state.totalImpact);
    totalImpactConverted = totalImpactConverted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let totalExpenseConverted = String(this.state.totalExpense);
    totalExpenseConverted = totalExpenseConverted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let returnOfImpactConverted = String(this.state.returnOfImpact);
    returnOfImpactConverted = returnOfImpactConverted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Return of Impact</h2>
        <div className="Return-impact-summary">
          <div className="card-number">
            <span>{this.state.returnOfImpact}%</span>
            <h4>Calculated ROI</h4>
          </div>
          <div className="card-text">
            <span>Since {this.state.startYear}, DemocracyLab has created impact valued at ${totalImpactConverted} for various nonprofits and
              tech-for-good projects by connecting them with volunteers. With total expense standing at ${totalExpenseConverted},
              this has generated {returnOfImpactConverted}% return of impact for every dollar spent.</span>
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
        <div class="roi-chart-desc">
          <p>Total expenses calculated between 1 January {this.state.startYear} and {this.state.endDay} {this.state.endMonth} {this.state.endYear}.</p>
          <p>ROI calculated by ((cumulative impact - cumulative expenses)/cumulative expenses).</p>
        </div>
      </React.Fragment>
    );
  }
}

export default ReturnOfImpact;
