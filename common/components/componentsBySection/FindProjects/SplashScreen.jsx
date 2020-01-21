// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import cdn from "../../utils/cdn.js";

type Props = {|
  header: string,
  text: ?$ReadOnlyArray<string>,
  bottomOverlayText: ?$ReadOnlyArray<string>,
  img: ?string,
  buttonSection: ?string,
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
          {this.props.header ? <h1>{this.props.header}</h1> : null}
          <div className="SplashScreen-section">
            {this.props.text ? <p>{this.props.text}</p> : null}
            {this.props.buttonSection ? this._renderButtons(this.props.buttonSection) : null}
          </div>
        </div>
        {!_.isEmpty(this.props.bottomOverlayText) && this._renderBottomOverlay()}
      </div>
    );
  }

  _renderButtons(sec) {
    // to render action items in our splash (usually buttons)
    //TODO: make this less gross than a big if/else/else/else/else mess
    if (sec === "findprojects") {
    return (
      <React.Fragment>
        <Button variant="primary" className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
          Find Projects
        </Button>
        <Button variant="primary" className="SplashScreen-create-project-btn" href={url.sectionOrLogIn(Section.CreateProject)}>
          Create A Project
        </Button>
      </React.Fragment>
    )
  } else if (sec === "landingtop") {
      return (
        <React.Fragment>
          <Button variant="primary" className="LandingController-topsplash-btn" href="#">Get Started</Button>
        </React.Fragment>
      )
    } else if (sec === "landingbottom") {
        return (
          <React.Fragment>
            <Button variant="primary" className="LandingController-bottomsplash-btn" href="#">Learn More</Button>
          </React.Fragment>
        )
    } else {
        return null;
      }
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
