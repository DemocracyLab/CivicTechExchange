import React from "react";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";


type Props = {|
|};

type State = {|
  returnOfImpact: number,
  estimatedImpact: number,
  activeVolunteerCount: number,
  activeProjectCount: number,
|};


class AggregatedDashboard extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      returnOfImpact: 0,
      estimatedImpact: 0,
      activeVolunteerCount: 0,
      activeProjectCount: 0,
    };
  }

  componentDidMount() {
    const url_impact: string = "/api/impact_data";
    fetch(new Request(url_impact))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          returnOfImpact: getResponse.roi,
          estimatedImpact: getResponse.total_impact,
        })
      );
    const url_stats: string = "/api/volunteers_stats";
    fetch(new Request(url_stats))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          activeVolunteerCount: getResponse.activeVolunteerCount,
          activeProjectCount: getResponse.projectCount,
        })
      );
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">DemocracyLab's Impact</h2>
        <div className="Aggregated-dashboard" id="dashboardDisplay">
            <div className="card card1">
                <span>{Math.round(this.state.returnOfImpact*100)}%</span>
                <h4>ROI</h4>
            </div>
            <div className="card card2">
                <span>${Math.round(this.state.estimatedImpact/1000000)}M</span>
                <h4>Estimated Impact</h4>
            </div>
            <div className="card card3">
                <span>{this.state.activeVolunteerCount}</span>
                <h4>Active Volunteers</h4>
            </div>
            <div className="card card4">
                <span>{this.state.activeProjectCount}</span>
                <h4>Active Projects</h4>
            </div>
        </div>
        <Button
            className="text-center AggregatedDashboard-button"
            variant="secondary"
            id="detailButton"
            href={url.section(Section.AggregatedDashboard)}
          >
            View More
          </Button>
      </React.Fragment>
    );
  }
}

export default AggregatedDashboard;