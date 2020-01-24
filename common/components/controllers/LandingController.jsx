// @flow

import React from 'react';
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import RecentProjectsSection from "../componentsBySection/Landing/RecentProjectsSection.jsx";
import TestimonialCarousel from "../componentsBySection/Landing/TestimonialCarousel.jsx";
import cdn from "../utils/cdn";
import Button from "react-bootstrap/Button";
import url from "../utils/url";
import Section from "../enums/Section";
import Vo1 from "../svg/volunteer1.svg";
import Vo2 from "../svg/volunteer2.svg";
import Vo3 from "../svg/volunteer3.svg";
import ArrowBlack from "../svg/arrowright-black.svg";
import Rec1 from "../svg/recruit1.svg";
import Rec2 from "../svg/recruit2.svg";
import Rec3 from "../svg/recruit3.svg";
import ArrowOrange from "../svg/arrowright-orange.svg";

class LandingController extends React.PureComponent<{||}> {

  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="FindProjectsController-root">
        <div className="container-fluid">
          {this._renderTopSplash()}
        </div>
        <div className="container">
          <RecentProjectsSection/>
          {this._renderPathFlows()}
          {this._renderMiddleSplash()}
          {this._renderTestimonials()}
          {this._renderPartnerSection()}
          {this._renderBottomSplash()}
        </div>
      </div>
    );
  }

  _renderTopSplash(): React$Node {
    const header: string = "Make Tech.  Do Good.";
    const text: string = "We connect skilled volunteers and tech-for-good projects";
    const buttonSection: string = "landingtop";

    return (
      <SplashScreen className="LandingController-topsplash" header={header} text={text} img={HeroImage.TopLanding} buttonSection={buttonSection}/>
    );
  }

  _renderPathFlows() {
    return (
      <div className="LandingController-pathflows row">
        <div className="col-xs-12 col-lg-6 LandingController-volunteer-flow">
          <h3>Want to Volunteer?</h3>
          <p>Apply your tech skills to projects that need them</p>
              <Vo1 /> <ArrowBlack /> <Vo2 /> <ArrowBlack /> <Vo3 />
              <p>
            1. Create a Profile
            2. Search Projects
            3. Connect with Project Leaders</p>
            <Button variant="outline-light">Start Volunteering!</Button>

          </div>
          <div className="col-xs-12 col-lg-6 LandingController-recruit-flow">
            <h3>Need Volunteers?</h3>
            <p>Find people with the tech skills you need</p>
            <Rec1 /> <ArrowOrange /> <Rec2 /> <ArrowOrange /> <Rec3 />
            <p>
              1. Add your organization
              2. List your project needs
              3. Find skilled volunteers</p>
              <Button variant="primary">Start Recruiting!</Button>

            </div>
          </div>
        )
      }
      
    _renderMiddleSplash() {
      const header: string = "Accelerating Civic Innovation";
      const text: string = "DemocracyLab is a non-profit organization. We are seeking to advance tech innovation in social, non-profit and civic sectors through the power of tech-for-good volunteerism."
      const buttonSection: string = "landingmid";

      return (
        <SplashScreen header={header} text={text} img={HeroImage.MidLanding} buttonSection={buttonSection}/>
      );
    }

    _renderTestimonials() {
      return (
        <div className="LandingController-testimonial-container">
          <h2>Testimonials</h2>
          <TestimonialCarousel className="LandingController-testimonial" />
        </div>
      )
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

  _renderBottomSplash(): React$Node {
    const header: string = "What are you waiting for?";
    const buttonSection: string = "landingbottom";

    return (
      <SplashScreen header={header} img={HeroImage.BottomLanding} buttonSection={buttonSection}/>
    );
  }

}
export default LandingController;
