// @flow

import React from 'react';
import NavigationDispatcher from "../../stores/NavigationDispatcher.js";
import Section from "../../enums/Section.js";
import CurrentUser from "../../utils/CurrentUser.js";
import urlHelper from "../../utils/url.js";

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
  
  _onClickCreateProject(): void {
    // TODO: Set up prev page to point login page to Create Project page
    const section: string = CurrentUser.isLoggedIn() ? Section.CreateProject : Section.LogIn;
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: section,
      url: urlHelper.section(section)
    });
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
            <button className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
              Find Civic-Tech Projects
            </button>
            <button className="SplashScreen-create-project-btn" onClick={this._onClickCreateProject.bind(this)}>
              Create A Project
            </button>
          </div>
        </div>
      </div>
    );
  }
  
}
export default SplashScreen;
