import React from "react";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";


type Props = {|
|};

type State = {|
|};

class Hackathons extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { };
  }

  componentDidMount() {
  }

  render(): React$Node {
    return (
      <React.Fragment>
       <h2 className="text-center AggregatedDashboard-title">Hackathons</h2>
      </React.Fragment>
    );
  }
}

export default Hackathons;
