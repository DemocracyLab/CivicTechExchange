import React from "react";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";


type Props = {|
|};

type State = {|
|};

class AggregatedDashboard extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">DemocarcyLab's Impact</h2>
        <div className="Aggregated-dashboard" id="dashboardDisplay">
            <div className="card card1">
                <span>4099%</span>
                <h4>Return of Impact</h4>
            </div>
            <div className="card card2">
                <span>$12M</span>
                <h4>Dollars Saved</h4>
            </div>
            <div className="card card3">
                <span>386</span>
                <h4>Active Volunteers</h4>
            </div>
            <div className="card card4">
                <span>87</span>
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
