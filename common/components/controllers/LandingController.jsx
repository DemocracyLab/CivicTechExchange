// @flow

import React from "react";
import SplashScreen, {
  HeroImage,
} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import RecentProjectsSection from "../componentsBySection/Landing/RecentProjectsSection.jsx";
import TestimonialCarousel from "../common/carousel/TestimonialCarousel.jsx";
import Partners from "../componentsBySection/Landing/Partners.jsx";
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
      <div className="LandingController-root">
        {this._renderTopSplash()}
        <div className="container">
          <div className="row">
            <RecentProjectsSection />
            {this._renderPathFlows()}
            {this._renderMiddleSplash()}
            {this._renderTestimonials()}
            {this._renderPartnerSection()}
            {this._renderPartnersInAction()}
            {this._renderBottomSplash()}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSplash(): React$Node {
    const header: string = "Make Tech.  Do Good.";
    const text: string =
      "We connect tech-for-good projects with skilled volunteers and socially responsible companies.";

    return (
      <SplashScreen
        className="LandingController-topsplash"
        header={header}
        text={text}
      >
        <Button
          variant="primary"
          className="SplashScreen-find-projects-btn LandingController-fixed-width-button"
          href={url.section(Section.FindProjects)}
        >
          Explore Projects
        </Button>
        <Button
          variant="primary"
          className="SplashScreen-create-project-btn LandingController-fixed-width-button"
          href={url.sectionOrLogIn(Section.CreateProject)}
        >
          Create A Project
        </Button>
        <Button
          variant="primary"
          className="SplashScreen-create-project-btn LandingController-fixed-width-button"
          href={url.section(Section.Companies)}
        >
          For Companies
        </Button>
      </SplashScreen>
    );
  }

  _renderPathFlows() {
    return (
      <div className="LandingController-pathflows row ml-0 mr-0">
        <div className="col-xs-12 col-lg-6 LandingController-volunteer-flow">
          <h3>Want to Volunteer?</h3>
          <p>Apply your tech skills to projects that need them</p>
          <div className="LandingController-pathflows-stepcontainer">
            <div className="LandingController-pathflows-item">
              <Vo2 />
              <p>1. Browse Projects</p>
            </div>
            <div className="LandingController-pathflows-arrow">
              <ArrowBlack />
            </div>
            <div className="LandingController-pathflows-item">
              <Vo1 />
              <p>2. Create a Profile</p>
            </div>
            <div className="LandingController-pathflows-arrow">
              <ArrowBlack />
            </div>
            <div className="LandingController-pathflows-item">
              <Vo3 />
              <p>3. Connect with Project Leaders</p>
            </div>
          </div>
          <Button href={url.section(Section.FindProjects)} variant="light">
            Start Volunteering!
          </Button>
        </div>
        <div className="col-xs-12 col-lg-6 LandingController-recruit-flow">
          <h3>Need Volunteers?</h3>
          <p>Find people with the tech skills you need</p>
          <div className="LandingController-pathflows-stepcontainer">
            <div className="LandingController-pathflows-item">
              <Rec3 />
              <p>1. Add Your Project</p>
            </div>
            <div className="LandingController-pathflows-arrow">
              <ArrowOrange />
            </div>
            <div className="LandingController-pathflows-item">
              <Rec2 />
              <p>2. List Your Needs</p>
            </div>
            <div className="LandingController-pathflows-arrow">
              <ArrowOrange />
            </div>
            <div className="LandingController-pathflows-item">
              <Rec1 />
              <p>3. Recruit Skilled Volunteers</p>
            </div>
          </div>

          <Button
            href={url.sectionOrLogIn(Section.CreateProject)}
            variant="primary"
          >
            Start Recruiting!
          </Button>
        </div>
      </div>
    );
  }

  _renderMiddleSplash() {
    const header: string = "Accelerating Civic Innovation";
    const text: string =
      "DemocracyLab is a nonprofit organization. We are advancing tech innovation in the social, nonprofit and civic sectors through the power of tech-for-good volunteerism.";

    return (
      <SplashScreen
        className="LandingController-midsplash"
        header={header}
        text={text}
        img={HeroImage.MidLanding}
      >
        <Button
          variant="primary"
          className="LandingController-midsplash-btn SplashScreen-create-project-btn"
          href={url.section(Section.AboutUs)}
        >
          Learn More
        </Button>
      </SplashScreen>
    );
  }

  _renderTestimonials() {
    return (
      <div className="LandingController-testimonial-container carousel-testimonial-root ">
        <h2 className="text-center headline1">Testimonials</h2>
        <TestimonialCarousel interval={15000} />
      </div>
    );
  }

  _renderPartnerSection() {
    return (
      <div
        className="LandingController-partner-section"
        style={cdn.bgImage("OurVisionBGoverlay.jpg")}
      >
        <div className="PartnerSection text-center">
          <h2>Partner With Us To Organize Your Next Hackathon</h2>
          <p>
            DemocracyLab is a leading organizer of tech-for-good hackathons.
          </p>
          <p>
            Let us help your company, non-profit or group strengthen your
            culture and make an impact!
          </p>
          <Button
            variant="outline-secondary"
            href={url.section(Section.Companies)}
          >
            Learn More
          </Button>
        </div>
      </div>
    );
  }

  _renderPartnersInAction() {
    const partnerLogos = Partners.map(i => (
      <div key={i.name} className="LandingController-partnersinaction-logo">
        <a href={i.link}>
          <img src={i.logo} alt={i.name} />
        </a>
      </div>
    ));

    return (
      <div className="LandingController-partnersinaction">
        <h2 className="text-center">Our Community Partners</h2>
        <div className="LandingController-partnersinaction-container">
          {partnerLogos}
        </div>
      </div>
    );
  }

  _renderBottomSplash(): React$Node {
    const header: string = "What are you waiting for?";

    return (
      <SplashScreen
        className="LandingController-bottom-splash"
        header={header}
        img={HeroImage.BottomLanding}
      >
        <Button
          variant="primary"
          className="LandingController-bottomsplash-btn"
          href={url.sectionOrLogIn(Section.FindProjects)}
        >
          Get Started
        </Button>
      </SplashScreen>
    );
  }
}
export default LandingController;
