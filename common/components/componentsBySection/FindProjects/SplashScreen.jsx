// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import Section from "../../enums/Section.js";
import CurrentUser from "../../utils/CurrentUser.js";
import urlHelper from "../../utils/url.js";

type Props = {|
  onClickFindProjects: () => void
|};

type State = {|
  createProjectUrl: string
|};

class SplashScreen extends React.PureComponent<Props, State> {
  constructor(): void {
    super();
  
    const createProjectUrl: string = CurrentUser.isLoggedIn()
      ? urlHelper.section(Section.CreateProject)
      : urlHelper.section(Section.LogIn, {"prev": Section.CreateProject});
    this.state = {
      createProjectUrl: createProjectUrl
    };
  }
  
  _onClickFindProjects(): void {
    this.props.onClickFindProjects();
  }

  render(): React$Node {
    return (
      <div className="SplashScreen-root">
        <div className="SplashScreen-content">
          <h2>Optimizing the connection between skilled volunteers and tech-for-good projects</h2>
          <div className="SplashScreen-section">
            DemocracyLab is a 501(c)(3) nonprofit organization
          </div>
          <div className="SplashScreen-section">
            <Button className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
              Find Civic-Tech Projects
            </Button>
            <Button className="SplashScreen-create-project-btn" href={this.state.createProjectUrl}>
              Create A Project
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
}
export default SplashScreen;
