// @flow

import React from 'react';

type Props = {|
  onClickFindProjects: () => void
|};


class SplashScreen extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }
  
  _onClickFindProjects(): void {
    this.props.onClickFindProjects();
  }

  render(): React$Node {
    return (
      <div className="SplashScreen-root">
        <div className="SplashScreen-content">
          <h2>Optimizing the connection between skilled volunteers and tech-for-good projects</h2>
          DemocracyLab is a 501(c)(3) nonprofit organization
          <button className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
            Find Civic-Tech Projects
          </button>
          <button className="SplashScreen-find-projects-btn">
            Create A Project
          </button>
        </div>
      </div>
    );
  }
  
}
export default SplashScreen;
