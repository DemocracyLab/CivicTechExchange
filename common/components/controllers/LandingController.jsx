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
        <div className="container">
          <div className="row">
            {this._renderHero()}
            {this._renderOptions()}
            {this._renderNextHackathon()}
            <RecentProjectsSection className="col-12" />
            {this._renderTestimonials()}
            {this._renderLatestBlogpost()}
            {this._renderCommunityPartners()}
          </div>
        </div>
      </div>
    );
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

  _renderOptions() {
    return (
      <div className="LandingController-options col-12">
        <h2>I'd like to...</h2>
        <p>scrollable/clickable row of 3 content boxes go here</p>
      </div>
    );
  }

  _renderNextHackathon(): React$Node {
    return (<div className="LandingController-next-hackathon col-12">
    <p>some function that returns a hackathon here i guess, probably don't render section at all if no upcoming?</p>
    </div>);
  }
  _renderTestimonials(): React$Node {
    return (
      <div className="LandingController-testimonial-container carousel-testimonial-root col-12">
        <h2 className="text-center">What people are saying about DemocracyLab</h2>
        <TestimonialCarousel interval={15000} />
      </div>
    );
  }

  _renderLatestBlogpost(): React$Node {
    return (
      <div className="LandingController-latestblogpost col-12">
        <p>latest blog post here</p>
      </div>
    )
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
