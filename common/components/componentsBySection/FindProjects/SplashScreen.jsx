// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import cdn from "../../utils/cdn.js";

// TODO: Make buttons configurable
type Props = {|
  header: string,
  text: ?$ReadOnlyArray<string>,
  bottomOverlayText: ?$ReadOnlyArray<string>,
  img: ?string,
  onClickFindProjects: () => void
|};

export const HeroImage: { [key: string]: string } = {
  TopLanding: "CodeForGood_072719_MSReactor-064.jpg",
  BottomLanding: "CodeForGood_072719_MSReactor-003.jpg",
};

const heroImages: $ReadOnlyArray<string> = [
  HeroImage.TopLanding,
  HeroImage.BottomLanding,
  "CodeForGood_072719_MSReactor-074.jpg",
  "CodeForGood_072719_MSReactor-020.jpg"
];

class SplashScreen extends React.PureComponent<Props> {
  _onClickFindProjects(): void {
    this.props.onClickFindProjects();
  }

  _heroRandomizer(): void {
    let imgIndex = Math.floor(Math.random() * Math.floor(heroImages.length));
    return cdn.image(heroImages[imgIndex])
  }

  render(): React$Node {
    const backgroundUrl: string = this.props.img ? cdn.image(this.props.img) : this._heroRandomizer();
    return (
      <div className="SplashScreen-root SplashScreen-opacity-layer SplashScreen-opacity50" style={{backgroundImage: 'url(' + backgroundUrl + ')' }}>
        <div className="SplashScreen-content">
          <h1>We connect skilled volunteers and tech-for-good projects</h1>
          <div className="SplashScreen-section">
            <Button variant="primary" className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
              Find Projects
            </Button>
            <Button variant="primary" className="SplashScreen-create-project-btn" href={url.sectionOrLogIn(Section.CreateProject)}>
              Create A Project
            </Button>
          </div>
        </div>
        {!_.isEmpty(this.props.bottomOverlayText) && this._renderBottomOverlay()}
      </div>
    );
  }
  
  _renderBottomOverlay(): React$Node {
    return (
      <div className="SplashScreen-mission SplashScreen-opacity-layer SplashScreen-opacity20">
        {this.props.bottomOverlayText.map((text) => (<p>{text}</p>))}
      </div>
    );
  }

}
export default SplashScreen;
