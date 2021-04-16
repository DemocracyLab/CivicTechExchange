// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import url from "../utils/url.js";
import cdn from "../utils/cdn.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TestimonialCarousel from "../../components/common/carousel/TestimonialCarousel.jsx";
import BlogCarousel from "../../components/common/carousel/BlogCarousel.jsx";
import ContactForm from "../../components/forms/ContactForm.jsx";
import JumpAnchor from "../common/JumpAnchor.jsx";
import _ from "lodash";
import IconCircle1 from "../svg/corporatehackathon/corp1circle.svg";
import IconCircle2 from "../svg/corporatehackathon/corp2circle.svg";
import IconCircle3 from "../svg/corporatehackathon/corp3circle.svg";
import type { Dictionary } from "../types/Generics.jsx";

type State = {|
  defaultTab: string,
|};

const tabOptions: Dictionary<string> = {
  hackathon: "tab-hackathon",
  sponsorship: "tab-sponsorship",
};

class CorporateHackathonController extends React.PureComponent<{||}, State> {
  constructor(props) {
    super(props);
    const tabArg: string = url.argument("tab");
    this.state = {
      defaultTab:
        tabArg && tabOptions[tabArg]
          ? tabOptions[tabArg]
          : tabOptions.hackathon,
    };
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        <div className="corporate-root container">
          {this._renderTop()}
          <div className="row">{this._renderTabs()}</div>
          <div className="row">{this._renderContact()}</div>
          {this._renderBottomImage()}
        </div>
      </React.Fragment>
    );
  }

  _renderTop(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-edge">
          <div className="row">
            <div
              className="col-12 corporate-top-image"
              style={{
                backgroundImage:
                  "url(" + cdn.image("corporate_header.jpg") + ")",
              }}
            >
              <div className="corporate-top-overlay">
                <h1>Together we can advance technology for the public good.</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="corporate-top col-12 corporate-section">
            <div className="corporate-top-flex">
              <div className="corporate-top-flex-section">
                <p>
                  DemocracyLab's success depends on creating value for our
                  corporate partners:
                </p>
                <ul>
                  <li>
                    Our custom employee engagement events build a culture of
                    purpose and spur innovation.
                  </li>
                  <li>
                    Sponsorship of our public hackathons differentiates your
                    brand and amplifies the impact of our diverse community.
                  </li>
                </ul>
                <p>
                  We make it easy and fun for your company to do well by doing
                  good.
                </p>
              </div>
              <div className="corporate-top-flex-button">
                <Button
                  variant="cta"
                  href="#contact"
                  className="corporate-cta-button"
                >
                  Partner With Us
                </Button>
              </div>
            </div>
            <h2>Learn more about opportunities below.</h2>
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderTabs(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-tab-section">
          <Tabs defaultActiveKey={this.state.defaultTab} id="corporate-tabs">
            <Tab eventKey={tabOptions.hackathon} title="Host a Hackathon">
              {this._renderHackathonTab()}
            </Tab>
            <Tab eventKey={tabOptions.sponsorship} title="Sponsorship">
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
          <h1>Why Host a Hackathon?</h1>
          <div className="row">
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h2>Cultivate Culture</h2>
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
                <h2>Drive Performance</h2>
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
                <h2>Amplify Impact</h2>
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
          <p className="corporate-sources-citation overline">
            Sources:
            <br />
            DemocracyLab post-event surveys <br />
            Deloitte{" "}
            <a
              className="overline"
              href="https://www2.deloitte.com/us/en/pages/about-deloitte/articles/culture-of-purpose.html"
              target="_blank"
            >
              "Culture of Purpose"
            </a>
          </p>
        </div>
        <div className="corporate-hackathon-howitworks corporate-section col-12">
          <h1>How it Works</h1>
          <div className="corporate-how-flex-container">
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle3 />
              </div>
              <div className="corporate-how-text-container">
                <div className="corporate-how-text">
                  <h2>Recruit</h2>
                  <p>
                    We find tech-for-good projects that are a good fit for your
                    team and help you motivate your employees to participate.
                  </p>
                </div>
              </div>
            </div>
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle3 />
              </div>
              <div className="corporate-how-text">
                <h2>Define</h2>
                <p>
                  We work with projects to define a narrow scope of work that
                  will help them fulfill their mission.
                </p>
              </div>
            </div>
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle3 />
              </div>
              <div className="corporate-how-text">
                <h2>Hack</h2>
                <p>
                  Your employees collaborate with project leaders to create
                  innovative tech-for-good solutions.
                </p>
              </div>
            </div>
          </div>
          <hr className="corporate-hr-line"></hr>

          <p className="corporate-how-after">
            After the event, DemocracyLab reports on the resulting engagement,
            outcomes, and impact.
          </p>
          <div className="corporate-how-after">
            <Button
              variant="cta"
              href="#contact"
              className="corporate-cta-button"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="corporate-hackathon-saying corporate-section col-12">
          <h1>What People Are Saying</h1>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel
              category="partner-highlights"
              interval={600000}
            />
          </div>
        </div>
        <div className="corporate-hackathon-stories corporate-section col-12">
          <h1>Impact Stories</h1>
          <div className="carousel-blog-root">
            <BlogCarousel tag="partner-highlights" interval={600000} />
          </div>
          <p className="size-h2">
            Read about other previous events in our{" "}
            <a className="size-h2" href={window.BLOG_URL} target="_blank">
              blog
            </a>
            , or other events that are coming up{" "}
            <a className="size-h2" href="/events">
              here
            </a>
            .
          </p>
        </div>
      </React.Fragment>
    );
  }

  _renderSponsorshipTab(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-sponsorship-why col-12">
          <h1>Why Partner With Us?</h1>
          <div className="row">
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-sponsorship-card">
                <h2>Impact</h2>
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
                <h2>Differentiation</h2>
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
                <h2>Value</h2>
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
          <div className="corporate-section col-12">
            <h2>
              Public hackathons are an opportunity to contribute with great
              visibility.
            </h2>
            <div className="corporate-sponsorship-stat-container">
              <div className="corporate-sponsorship-stat">
                <h4>$1&nbsp;Million+</h4>
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
        </div>
        <div className="corporate-sponsorship-how corporate-section">
          <h1>How it Works</h1>
          <p>image</p>
          <h2>
            Our public tech-for-good hackathons are the pulse of our community
          </h2>
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
        <div className="corporate-sponsorship-saying corporate-section col-12">
          <h1>What People Are Saying</h1>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel
              category="hackathon-highlights"
              interval={600000}
            />
          </div>
        </div>
        <div className="corporate-sponsorship-impact corporate-section col-12">
          <h1>Impact Stories</h1>
          <div className="carousel-blog-root">
            <BlogCarousel tag="hackathon-highlights" interval={600000} />
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
          <h1>Take The First Step!</h1>
          <h2>
            To receive more information about becoming a corporate partner,
            complete and submit the form below.
          </h2>
          <ContactForm showInterests={true} />
        </div>
      </React.Fragment>
    );
  }

  _renderBottomImage(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-edge">
          <div className="row">
            <div
              className="corporate-bottom-image col-12"
              style={{
                backgroundImage:
                  "url(" + cdn.image("corporate_footer.jpg") + ")",
              }}
            >
              <div className="corporate-bottom-overlay"></div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CorporateHackathonController;
