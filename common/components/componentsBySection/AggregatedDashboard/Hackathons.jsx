import React from "react";


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
       <div className="hackathon-section">
          <div className="hackathon-card card1">
              <span>30+</span>
              <h4>Hackathons organized</h4>
          </div>
          <div className="hackathon-card card2">
              <span>2.5k+</span>
              <h4>Hackathon participants</h4>
          </div>
        </div>
        <h4 className="bottom-text">
          Hackathons play a pivotal role in the culture at DemocracyLab. They provide an
          invaluable opportunity for projects to make incremental progress toward their
          long-term goals and have also been instrumental in helping volunteers establish
          enduring relationships with projects that align with their expertise and interests.
        </h4>
      </React.Fragment>
    );
  }
}

export default Hackathons;
