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
      <h4 className="bottom-text">Aliquam at ex cursus odio rhoncus euismod non non dolor. Nunc volutpat nunc at turpis egestas fermentum.
        Donec vulputate volutpat neque, vitae consequat lacus accumsan tristique. Integer consequat nisi ac metus
        porttitor, in mollis dolor tristique. Curabitur cursus velit elit, eu feugiat lorem accumsan eget. Fusce sem
        odio, consectetur et enim vel, interdum vulputate lorem. Integer justo purus, fermentum scelerisque leo iaculis,
        volutpat sodales felis.</h4>
      </React.Fragment>
    );
  }
}

export default Hackathons;
