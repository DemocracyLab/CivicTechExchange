// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import url from "../utils/url.js";
import cdn from "../utils/cdn.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ghostApiHelper, { GhostPost } from "../utils/ghostApi.js";
import TestimonialCarousel from "../../components/common/carousel/TestimonialCarousel.jsx";
import BlogCarousel from "../../components/common/carousel/BlogCarousel.jsx";
import _ from "lodash";

// !!! TODO: this import is for testing only! don't let it into prod.
import Testimonials from "../../components/componentsBySection/Landing/HomepageTestimonials.jsx";

type State = {|
  ghostPosts: $ReadOnlyArray<GhostPost>,
|};

class CorporateHackathonController extends React.PureComponent<{||}, State> {
  constructor(props) {
    super(props);
    this.state = { ghostPosts: {} };
  }

  componentDidMount() {
    ghostApiHelper &&
      ghostApiHelper.browse("tech-for-good", this.loadGhostPosts.bind(this));
  }

  loadGhostPosts(ghostPosts: $ReadOnlyArray<GhostPost>) {
    console.log(JSON.stringify(ghostPosts));
    this.setState({ ghostPosts: ghostPosts });
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        <div className="corporate-root container">
          <div className="row">
            {this._renderTop()}
            {this._renderTabs()}
            {this._renderContact()}
            {this._renderBottomImage()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderTop(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
          <h1>Together we can advance technology for the public good.</h1>
          <p>
            DemocracyLab's success depends on creating value for our corporate
            partners:
          </p>
          <ul>
            <li>
              Our custom employee engagement events build a culture of purpose
              and spur innovation.
            </li>
            <li>
              Sponsorship of our public hackathons differentiates your brand and
              amplifies the impact of our diverse community.
            </li>
          </ul>
          <p>
            We make it easy and fun for your company to do well by doing good.
          </p>
          <Button
            variant="cta"
            href="#contact"
            className="corporate-cta-button"
          >
            Partner With Us
          </Button>
        </div>
      </React.Fragment>
    );
  }

  _renderTabs(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
          <h2>Learn more about opportunities below.</h2>
          <Tabs defaultActiveKey="tab-hackathon" id="corporate-tabs">
            <Tab eventKey="tab-hackathon" title="Host a Hackathon">
              {this._renderHackathonTab()}
            </Tab>
            <Tab eventKey="tab-sponsorship" title="Sponsorship">
              {this._renderSponsorshipTab()}
            </Tab>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }

  _renderHackathonTab(): $React$Node {
    return (
      <React.Fragment>
        <div className="corporate-hackathon-whyhost">
          <h3>Why Host a Hackathon?</h3>
          <div className="row">
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h4>Cultivate Culture</h4>
                <p>
                  Our events allow your employees to take risks, try bold new
                  strategies, and share their knowledge in a low-pressure
                  environment, all while contributing to the public good.
                </p>
                <p>
                  73% of DemocracyLab’s corporate hackathon participants
                  reported an increase in enthusiasm for working at their
                  company.
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h4>Drive Performance</h4>
                <p>
                  91% of respondents (executives and employees) who said their
                  company had a strong sense of purpose also said their company
                  had a history of strong financial performance.
                </p>
                <p>
                  75% of DemocracyLab’s corporate hackathon participants
                  reported increased belief that they could make a positive
                  impact in the world.
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h4>Amplify Impact</h4>
                <p>
                  Systematic change requires a shift in power. That means that a
                  top-down approach to social innovation won’t produce the
                  equitable outcomes society needs.
                </p>
                <p>
                  DemocracyLab serves projects from social impact startups,
                  nonprofits and governments. We help your employees use their
                  most valuable skills to address society’s toughest problems.
                </p>
              </div>
            </div>
          </div>
          <p className="corporate-sources-citation">
            Sources: DemocracyLab post-event surveys, Deloitte{" "}
            <a href="https://www2.deloitte.com/us/en/pages/about-deloitte/articles/culture-of-purpose.html">
              "Culture of Purpose"
            </a>
          </p>
        </div>
        <div className="corporate-hackathon-howitworks">
          <h3>How it Works</h3>
          <p>recruit define hack stuff here</p>
          <img src={cdn.image("recruit-icon.png")} alt="Recruit" />
          <img src={cdn.image("define-icon.png")} alt="Define" />
          <img src={cdn.image("hack-icon.png")} alt="Hack" />
        </div>
        <div className="corporate-hackathon-saying">
          <h3>What People Are Saying</h3>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel items={Testimonials} interval={600000} />
          </div>
        </div>
        <div className="corporate-hackathon-stories">
          <h3>Impact Stories</h3>
          <div className="carousel-blog-root">
            {!_.isEmpty(this.state.ghostPosts) && (
              <BlogCarousel items={this.state.ghostPosts} interval={600000} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderSponsorshipTab(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-sponsorship-why">
          <h3>Why Partner With Us?</h3>
          <div className="row">
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-sponsorship-card">
                <h4>Impact</h4>
                <p>
                  Your investment will support hundreds of tech-for-good
                  projects that use DemocracyLab’s platform to attract the
                  skilled volunteers they need to launch their products and
                  prove their concepts.
                </p>
                <p>
                  DemocracyLab will use your investment to support our public
                  events, scale our operations, and accelerate our growth.
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-sponsorship-card">
                <h4>Differentiation</h4>
                <p>
                  DemocracyLab’s unique product and positioning make sponsorship
                  a bold way to demonstrate your company’s commitment to social
                  responsibility.
                </p>
                <p>
                  Our community of volunteers is tomorrow’s diverse, dynamic,
                  and purpose-driven workforce. Sponsorship lets them know your
                  company helped create the opportunities they are enjoying.
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-sponsorship-card">
                <h4>Value</h4>
                <p>
                  For a fraction of the cost of a typical corporate event, your
                  company can become part of the accelerating tech-for-good
                  movement.
                </p>
                <p>
                  Today's sponsorship pricing is a bargain. Buy low and enjoy a
                  significant return on your company's investment!
                </p>
              </div>
            </div>
          </div>
          <h4>
            Public hackathons are an opportunity to contribute with great
            visibility.
          </h4>
          <p>4 stat items here, public value, volunteers, event attendees...</p>
        </div>
        <div className="corporate-sponsorship-how">
          <h3>How it Works</h3>
          <p>image</p>
          <h4>
            Our public tech-for-good hackathons are the pulse of our community
          </h4>
          <p>
            Six times a year, the DemocracyLab community convenes to move the
            needle on projects and build connections around the world. Your
            support will increase our capacity, amplify impact, and innovate
            your brand.
          </p>
          <Button
            variant="cta"
            href="#contact"
            className="corporate-cta-button"
          >
            Learn More
          </Button>
        </div>
        <div className="corporate-sponsorship-saying">
          <h3>What People Are Saying</h3>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel items={Testimonials} interval={600000} />
          </div>
        </div>
        <div className="corporate-sponsorship-impact">
          <h3>Impact Stories</h3>
          <div className="carousel-blog-root">
            {!_.isEmpty(this.state.ghostPosts) && (
              <BlogCarousel items={this.state.ghostPosts} interval={600000} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
  //TODO: reusable anchor component, reads nav height for an offset value (position relative, top -xyz px)

  _renderContact(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
          <a id="contact"></a>
          <h3>Take The First Step!</h3>
          <p>contact form goes here</p>
        </div>
      </React.Fragment>
    );
  }

  _renderBottomImage(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
          <p>bottom image with a gradient fade to white on the top edge</p>
        </div>
      </React.Fragment>
    );
  }
}

export default CorporateHackathonController;
