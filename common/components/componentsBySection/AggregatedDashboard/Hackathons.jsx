import React from "react";


type Props = {|
|};

type State = {|
  hackathonCount: number,
  hackathonParticipants: number
|};

class Hackathons extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = {
      hackathonCount: 0,
      hackathonParticipants: 0
    };
  }

  componentDidMount() {
    const url_impact: string = "/api/hackathon_stats";
    fetch(new Request(url_impact))
      .then(response => response.json())
      .then(getResponse =>
        this.setState({
          hackathonCount: getResponse.total_hackathon_count,
          hackathonParticipants: getResponse.total_hackathon_participants,
        })
      );
  }


  render(): React$Node {
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">Hackathons</h2>
        <div className="hackathon-section">
          <div className="hackathon-card">
            <span>{this.state.hackathonCount}</span>
            <h4>Hackathons organized</h4>
          </div>
          <div className="hackathon-card">
            <span>{this.state.hackathonParticipants}</span>
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
