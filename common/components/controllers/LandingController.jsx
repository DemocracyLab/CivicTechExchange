// @flow

import React from 'react';
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import RecentProjectsSection from "../componentsBySection/Landing/RecentProjectsSection.jsx";
import cdn from "../utils/cdn";
import Button from "react-bootstrap/Button";
import url from "../utils/url";
import Section from "../enums/Section";

class LandingController extends React.PureComponent<{||}> {

  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="FindProjectsController-root container">
        {this._renderTopSplash()}
        <RecentProjectsSection/>
        {this._renderPartnerSection()}
        {this._renderBottomSplash()}
      </div>
    );
  }

  _renderPartnerSection() {
    return (
      <div className="about-us-vision" style={cdn.bgImage('OurVisionBGoverlay.jpg')}>
        <div className="PartnerSection">
          <h2>Partner With Us to Organize your Next Hackathon</h2>
          <p>DemocracyLab is the leading organizer for Tech-for-Good Hackathons.</p>
          <p>Let us help your company, non-profit or group organize your next Hackathon.</p>
          <Button variant="primary" className="SplashScreen-create-project-btn" href={url.sectionOrLogIn(Section.PartnerWithUs)}>
            Learn More
          </Button>
        </div>
      </div>
    )
  }
  
  _renderTopSplash(): React$Node {
    const header: string = "Make Tech.  Do Good.";
    const text: string = "We connect skilled volunteers and tech-for-good projects";
    
    return (
      <SplashScreen header={header} text={text} img={HeroImage.TopLanding}/>
    );
  }
  
  _renderBottomSplash(): React$Node {
    const header: string = "What are you waiting for?";
    
    return (
      <SplashScreen header={header} img={HeroImage.BottomLanding}/>
    );
  }
  
}
export default LandingController;
