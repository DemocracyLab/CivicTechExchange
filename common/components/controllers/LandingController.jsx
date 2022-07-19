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
import ProjectChart from "../svg/homepage/chart.svg";
import GreenSplitDot from "../svg/homepage/green-split-dot.svg";
import YellowDot from "../svg/homepage/yellow-dot.svg";
import RedDot from "../svg/homepage/red-dot.svg";

class LandingController extends React.PureComponent<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="LandingController-root">
        <div className="container">
          <div className="row">
            {this._renderHero()}
            {this._renderOptions()}
            {this._renderNextHackathon()}
            {this._recentProjects()}
            {this._renderTestimonials()}
            {this._renderLatestBlogpost()}
            {this._renderCommunityPartners()}
          </div>
        </div>
      </div>
    );
  }

  _recentProjects(): React$Node {
    return (
      <div className="col-12">
        <RecentProjectsSection />
      </div>
    )
  }

  _renderHero(): React$Node {
    return (
      <div className="LandingController-hero col-12">
        <h1>Make Tech. Do Good.</h1>
        <p>
          We connect tech-for-good projects with skilled volunteers and socially
          responsible companies.
        </p>
        <div className="LandingController-hero-video">
          <span>(pretend a video is here)</span>
        </div>
      </div>
    );
  }

  _renderOptions(): React$Node {
    return (
      <div className="LandingController-options col-12">
        <h2>I'd like to...</h2>
        <p>
          scrollable/clickable row of 3 content boxes go here: "Volunteer",
          "Create a Project", and "Be a Partner"
        </p>
      </div>
    );
  }

  _volunteerSection(): React$Node {
    return (
      <div className="LandingController-volunteer-section">
        <p>Why volunteer with a DemocracyLab Project?</p>
        <p>3 svgs I don't have yet</p>
        <Button variant="primary">Volunteer Now</Button>
      </div>
    );
  }

  _createProjectSection(): React$Node {
    return (
      <React.Fragment>
        <div className="LandingController-createproject-section">
          <p>Why create a project on DemocracyLab?</p>
        </div>
        <div className="LandingController-chart-section">
          <p>(chart goes here)</p>
        </div>
      </React.Fragment>
    );
  }

  _partnerSection(): React$Node {
    return (
      <div className="LandingController-partner-section">
        <p>Why become a sponsor?</p>
        <Button variant="primary">Become a Sponsor</Button>
        <p>Why host a tech-for-good-hackathon?</p>
        <Button variant="primary">Host a Hackathon</Button>
      </div>
    );
  }

  _renderNextHackathon(): React$Node {
    return (
      <div className="LandingController-next-hackathon col-12">
        <p>
          some function that returns a hackathon here i guess, probably don't
          render section at all if no upcoming?
        </p>
      </div>
    );
  }
  _renderTestimonials(): React$Node {
    return (
      <div className="LandingController-testimonial-container carousel-testimonial-root col-12">
        <h2 className="text-center">
          What people are saying about DemocracyLab
        </h2>
        <TestimonialCarousel interval={15000} />
      </div>
    );
  }

  _renderLatestBlogpost(): React$Node {
    return (
      <div className="LandingController-latestblogpost col-12">
        <p>latest blog post here</p>
      </div>
    );
  }

  _renderCommunityPartners() {
    const partnerLogos = Partners.map(i => (
      <div key={i.name} className="LandingController-partnersinaction-logo">
        <a href={i.link}>
          <img src={i.logo} alt={i.name} />
        </a>
      </div>
    ));

    return (
      <div className="LandingController-partnersinaction col-12">
        <h2 className="text-center">Our Community Partners</h2>
        <div className="LandingController-partnersinaction-container">
          {partnerLogos}
        </div>
      </div>
    );
  }
}
export default LandingController;
