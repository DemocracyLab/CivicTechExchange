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
import ContactForm from "../../components/forms/ContactForm.jsx";
import JumpAnchor from "../common/JumpAnchor.jsx";
import _ from "lodash";

// !!! TODO: this import is for testing only! don't let it into prod.
import Testimonials from "../../components/componentsBySection/Landing/HomepageTestimonials.jsx";

type State = {|
  partnerPosts: $ReadOnlyArray<GhostPost>,
  hackathonPosts: $ReadOnlyArray<GhostPost>,
|};

class CorporateHackathonController extends React.PureComponent<{||}, State> {
  constructor(props) {
    super(props);
    this.state = { partnerPosts: [], hackathonPosts: [] };
  }

  componentDidMount() {
    ghostApiHelper &&
      ghostApiHelper.browse(
        "partner-highlights",
        this.loadPartnerPosts.bind(this)
      );
    ghostApiHelper &&
      ghostApiHelper.browse(
        "hackathon-highlights",
        this.loadHackathonPosts.bind(this)
      );
  }
  //TODO: make this one function which takes args
  loadPartnerPosts(ghostPosts: $ReadOnlyArray<GhostPost>) {
    this.setState({ partnerPosts: ghostPosts });
  }
  loadHackathonPosts(ghostPosts: $ReadOnlyArray<GhostPost>) {
    this.setState({ hackathonPosts: ghostPosts });
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
        <div className="corporate-top col-12">
          <div
            className="no-gutters corporate-top-overlay"
            style={{
              backgroundImage: "url(" + cdn.image("corporate_header.jpg") + ")",
            }}
          >
            <h1>Together we can advance technology for the public good.</h1>
          </div>

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
          <h2>Learn more about opportunities below.</h2>
        </div>
      </React.Fragment>
    );
  }

  _renderTabs(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-tab-section">
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
        <div className="corporate-hackathon-whyhost col-12">
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
            Sources:
            <br />
            DemocracyLab post-event surveys <br />
            Deloitte{" "}
            <a
              href="https://www2.deloitte.com/us/en/pages/about-deloitte/articles/culture-of-purpose.html"
              target="_blank"
            >
              "Culture of Purpose"
            </a>
          </p>
        </div>
        <div className="corporate-hackathon-howitworks corporate-section col-12">
          <h3>How it Works</h3>
          <img src={cdn.image("recruit-icon.png")} alt="Recruit" />
          <h4>Recruit</h4>
          <p>
            We find tech-for-good projects that are a good fit for your team and
            help you motivate your employees to participate.
          </p>
          <img src={cdn.image("define-icon.png")} alt="Define" />
          <h4>Define</h4>
          <p>
            We work with projects to define a narrow scope of work that will
            help them fulfill their mission.
          </p>
          <img src={cdn.image("hack-icon.png")} alt="Hack" />
          <h4>Hack</h4>
          <p>
            Your employees collaborate with project leaders to create innovative
            tech-for-good solutions.
          </p>

          <p>
            After the event, DemocracyLab reports on the resulting engagement,
            outcomes, and impact.
          </p>
          <Button
            variant="cta"
            href="#contact"
            className="corporate-cta-button"
          >
            Learn More
          </Button>
        </div>
        <div className="corporate-hackathon-saying corporate-section col-12">
          <h3>What People Are Saying</h3>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel items={Testimonials} interval={600000} />
          </div>
        </div>
        <div className="corporate-hackathon-stories corporate-section col-12">
          <h3>Impact Stories</h3>
          <div className="carousel-blog-root">
            {!_.isEmpty(this.state.hackathonPosts) && (
              <BlogCarousel items={this.state.hackathonPosts} interval={600000} />
            )}
          </div>
          <p>
            Read about other previous events in our{" "}
            <a href={window.BLOG_URL} target="_blank">
              blog
            </a>
            , or other events that are coming up <a href="/events">here</a>.
          </p>
        </div>
      </React.Fragment>
    );
  }

  _renderSponsorshipTab(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-sponsorship-why col-12">
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
          <div className="corporate-sponsorship-stat-container">
            <div className="corporate-sponsorship-stat">
              <h4>$1 Million+</h4>
              <p>Public Value Created</p>
            </div>
            <div className="corporate-sponsorship-stat">
              <h4>1500+</h4>
              <p>Volunteers</p>
            </div>
            <div className="corporate-sponsorship-stat">
              <h4>100</h4>
              <p>Avg Event Attendees</p>
            </div>
            <div className="corporate-sponsorship-stat">
              <h4>250+</h4>
              <p>Project Teams</p>
            </div>
          </div>
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
        <div className="corporate-sponsorship-saying col-12">
          <h3>What People Are Saying</h3>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel items={Testimonials} interval={600000} />
          </div>
        </div>
        <div className="corporate-sponsorship-impact col-12">
          <h3>Impact Stories</h3>
          <div className="carousel-blog-root">
            {!_.isEmpty(this.state.partnerPosts) && (
              <BlogCarousel items={this.state.partnerPosts} interval={600000} />
            )}
          </div>
          <p>
            Read about other previous events in our{" "}
            <a href={window.BLOG_URL} target="_blank">
              blog
            </a>
            , or other events that are coming up <a href="/events">here</a>.
          </p>
        </div>
      </React.Fragment>
    );
  }
  _renderContact(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section corporate-contact col-12">
          <JumpAnchor id="contact" />
          <h3>Take The First Step!</h3>
          <h4>
            To receive more information about becoming a corporate partner,
            complete and submit the form below.
          </h4>
          <ContactForm showInterests={true} />
        </div>
      </React.Fragment>
    );
  }

  _renderBottomImage(): React$Node {
    return (
      <React.Fragment>
        <div
          className="corporate-bottom corporate-bottom-overlay col-12 no-gutters"
          style={{
            backgroundImage: "url(" + cdn.image("corporate_footer.jpg") + ")",
          }}
        ></div>
      </React.Fragment>
    );
  }
}

export default CorporateHackathonController;
