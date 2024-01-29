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
  quarterList: Array<string>,
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
      quarterList: [],
      impactList: [],
      expenseList: [],
      startYear: '',
      endDay: '',
      endMonth: '',
      endYear: '',
      retryCount: 0,
      maxRetries: 3, // Maximum number of retries
      retryDelay: 1000 // Delay between retries in milliseconds
    };
  }

  async componentDidMount() {
    this.fetchImpactData();
  }

  fetchImpactData = async () => {
    const { retryCount, maxRetries, retryDelay } = this.state;
    const url_impact = "/api/impact/impact_data";

    try {
      const response = await fetch(url_impact);
      if (!response.ok) {
        if (retryCount < maxRetries) {
          setTimeout(() => {
            this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
            this.fetchImpactData();
          }, retryDelay);
        }
        throw new Error('Max retries reached. ' + response.statusText);
      } else {
        const getResponse = await response.json();
        this.setState({
          returnOfImpact: Math.round(getResponse.roi*100),
          historyData: getResponse.history,
          totalImpact: getResponse.total_impact,
          totalExpense: getResponse.total_expense,
          dateList: getResponse.history.map(item => item.quarter_date),
          yearList: getResponse.history.map(item => item.quarter_date.substring(0, 4)),
          quarterList: getResponse.history.map((item, index) => `Q${(index % 4) + 1} ${item.quarter_date.substring(0, 4)}`),
          impactList: getResponse.history.map(item => item.quarterly_impact),
          expenseList: getResponse.history.map(item => item.expense),
          retryCount: 0 // Reset retry count on successful fetch
        });
        // Additional setState for startYear, endDay, endMonth, endYear
        this.setState({
          startYear: this.state.yearList[0],
          endDay: this.state.dateList[this.state.dateList.length-1].substring(8,10),
          endMonth: monthList[parseInt(this.state.dateList[this.state.dateList.length-1].substring(5,7))-1],
          endYear: this.state.yearList[this.state.yearList.length-1],
        });
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  render(): React$Node {
    const data = {
      labels: this.state.quarterList,
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
          grid: {
            // Hide all the vertical stick lines
            display: false,
          },
          ticks: {
            font: {
              family:'Montserrat'
            },
            // Show the x-axis label for every 4 datapoints
            callback: function(val, index) {
              return (index % 4) ? null : this.getLabelForValue(val);
            },
          }
        },
        y: {
          max: 2000000, // $2M (might need to be updated in the future)
          min: 0,
          ticks: {
            count: 5,
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
              tech-for-good projects by connecting them with skilled volunteers. With total expense standing at ${totalExpenseConverted},
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
          <p>Impact is estimated by summing the number of weekly active volunteers, multiplying by an assumed 2.5 hours/week, and multiplying by an assumed $50/hour.</p>
        </div>
      </React.Fragment>
    );
  }
}

export default ReturnOfImpact;
