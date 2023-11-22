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
      retryCount: 0,
      maxRetries: 3, // Maximum number of retries
      retryDelay: 1000 // Delay between retries in milliseconds
    };
  }

  componentDidMount() {
    this.fetchHackathonStats();
  }

  fetchHackathonStats = () => {
    const { retryCount, maxRetries, retryDelay } = this.state;
    const url_impact = "/api/hackathon_stats";

    fetch(new Request(url_impact))
      .then(response => {
        if (!response.ok) {
          if (retryCount < maxRetries) {
            setTimeout(() => {
              this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
              this.fetchHackathonStats();
            }, retryDelay);
          } else {
            throw new Error('Max retries reached. ' + response.statusText);
          }
        }
        return response.json();
      })
      .then(getResponse => {
        this.setState({
          hackathonCount: getResponse.total_hackathon_count,
          hackathonParticipants: getResponse.total_hackathon_participants,
          retryCount: 0 // Reset retry count on successful fetch
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
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
