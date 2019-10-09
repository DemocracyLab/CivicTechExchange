// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import cdn from "../../utils/cdn.js";

type Props = {|
  onClickFindProjects: () => void
|};

const heroImages: $ReadOnlyArray<string> = [
  "CodeForGood_072719_MSReactor-003.jpg",
  "CodeForGood_072719_MSReactor-074.jpg",
  "CodeForGood_072719_MSReactor-020.jpg",
  "CodeForGood_072719_MSReactor-064.jpg"
]

class SplashScreen extends React.PureComponent<Props> {
  _onClickFindProjects(): void {
    this.props.onClickFindProjects();
  }

  _heroRandomizer(): void {
    let imgIndex = Math.floor(Math.random() * Math.floor(heroImages.length));
    return cdn.image(heroImages[imgIndex])
  }

  render(): React$Node {
    return (
      <div className="SplashScreen-root SplashScreen-opacity-layer SplashScreen-opacity50" style={{backgroundImage: 'url(' + this._heroRandomizer() + ')' }}>
        <div className="SplashScreen-content">
          <h1>We connect skilled volunteers and tech-for-good projects</h1>
          <div className="SplashScreen-section">
            <Button className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
              Find Projects
            </Button>
            <Button className="SplashScreen-create-project-btn" href={url.sectionOrLogIn(Section.CreateProject)}>
              Create A Project
            </Button>
          </div>
        </div>
        <div className="SplashScreen-mission SplashScreen-opacity-layer SplashScreen-opacity20">
          <p>DemocracyLab is a nonprofit organization.</p>
          <p>Our mission is to empower people who use technology to advance the public good.</p>
        </div>
      </div>
    );
  }

}
export default SplashScreen;
