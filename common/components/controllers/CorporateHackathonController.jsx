// democracylab.org/companies page --- TODO: rename controller

// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
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
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";

type State = {|
  defaultTab: string,
|};

export const CorporatePageTabs: Dictionary<string> = {
  Hackathon: "hackathon",
  Sponsorship: "sponsorship",
};

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
                <h1>Do well by doing good.</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="corporate-top col-12 corporate-section">
            <div className="corporate-top-flex">
              <div className="corporate-top-flex-section">
                <h1>Partner with DemocracyLab to make a difference.</h1>
                <h2>Ways to work together:</h2>
                <ul>
                  <li>
                    <span className="h4">
                      Host a custom tech-for-good hackathon event.
                    </span>
                    <p>
                      Promote employee engagement and give back to your
                      community.
                    </p>
                  </li>
                  <li>
                    <span className="h4">
                      Sponsor the DemocracyLab platform and public hackathons.
                    </span>
                    <p>
                      Differentiate your brand and show your commitment to the
                      tech-for-good movement.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
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
            <Tab
              eventKey={tabOptions.hackathon}
              title="Host a Tech-for-Good Hackathon"
            >
              {this._renderHackathonTab()}
            </Tab>
            <Tab
              eventKey={tabOptions.sponsorship}
              title="Sponsor our platform & Public Events"
            >
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
          <h1>Benefits of hosting an in-house hackathon.</h1>
          <div className="row">
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h2>Engage your team and give back to your community</h2>
                <h3>
                  Strengthen employee enthusiasm, participate in meaningful
                  projects, and instill a sense of purpose.
                </h3>
                <p>
                  73% of our corporate hackathon participants reported an
                  increase in enthusiasm for working at their company.
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h2>Drive performance</h2>
                <h3>
                  Spur innovation and turn your culture of purpose into
                  bottom-line results.
                </h3>
                <p>
                  91% of executives and employees correlate a sense of purpose
                  with a history of strong financial performance. (Deloitte)
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4">
              <div className="corporate-hackathon-card">
                <h2>Enjoy a significant return on investment</h2>
                <h3>
                  Increased employee enthusiasm and engagement leads to lower
                  turnover rates and higher profitability.
                </h3>
                <p>
                  Highly engaged teams realize 59% less turnover and 21% greater
                  profitability. (Gallup)
                </p>
              </div>
            </div>
          </div>
          <p>
            Learn more:{" "}
            <a
              href={cdn.document(
                "2021+DemocracyLab+Corporate+Hackathon+Prospectus.pdf"
              )}
            >
              Corporate Tech-for-Good Hackathons PDF{" "}
              <i className={Glyph(GlyphStyles.PDF, GlyphSizes.X1)}></i>
            </a>
          </p>
          <Button 
          variant="primary"
          href="#">Get Started
          </Button>
          {/* this button jumps down to the contact form FOR the hackathon section, see issue #820 */}
        </div>
        <div className="corporate-hackathon-howitworks corporate-section col-12">
          <h1>How it works:</h1>
          <h2>We do the heavy lifting. Your employees make an impact. Your organization thrives.</h2>
          <div className="corporate-how-flex-container">
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle1 />
              </div>
              <div className="corporate-how-text-container">
                <div className="corporate-how-text">
                  <h2>1. Discover</h2>
                  <p>
                    We find tech-for-good projects that are a good fit for your
                    team and help you motivate your employees to participate.
                  </p>
                </div>
              </div>
            </div>
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle2 />
              </div>
              <div className="corporate-how-text">
                <h2>2. Define</h2>
                <p>
                  We determine project scope to match your employees' strengths.
                </p>
              </div>
            </div>
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle3 />
              </div>
              <div className="corporate-how-text">
                <h2>3. Collaborate</h2>
                <p>
                 Together, we make a positive impact at your tech-for-good hackathon!
                </p>
              </div>
            </div>
          </div>
          <hr className="corporate-hr-line"></hr>

          <h3 className="corporate-how-after">
            After the event, DemocracyLab reports on the resulting engagement,
            outcomes, and impact.
          </h3>
          <div className="corporate-how-after corporate-learn-link"></div>
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
          <p className="headline2 font-weight-normal">
            Read about other previous events in our{" "}
            <a
              className="headline2 font-weight-normal"
              href={window.BLOG_URL}
              target="_blank"
            >
              blog
            </a>
            , or other events that are coming up{" "}
            <a
              className="headline2 font-weight-normal"
              href={url.section(Section.FindEvents)}
            >
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
            <h2 className="corporate-sponsorship-stat-title">
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
        <div className="corporate-sponsorship-how col-12 corporate-section">
          <h1>How it Works</h1>
          <div className="corporate-sponsorship-how-flex">
            <div className="corporate-sponsorship-how-image">
              <img
                src={cdn.image("corporate-hiw.png")}
                alt="Sponsorship image"
              />
            </div>
            <div className="corporate-sponsorship-how-text">
              <h2>
                Our public tech-for-good hackathons are the pulse of our
                community
              </h2>
              <p>
                Six times a year, the DemocracyLab community convenes to move
                the needle on projects and build connections around the world.
                Your support will increase our capacity, amplify impact, and
                innovate your brand.
              </p>
            </div>
          </div>
          <div className="corporate-sponsorship-how-button corporate-learn-link">
            <a
              href={cdn.document(
                "2021+DemocracyLab+Sponsorship+Prospectus.pdf"
              )}
            >
              Learn More
              <i className={Glyph(GlyphStyles.PDF, GlyphSizes.X1)}></i>
            </a>
          </div>
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
          <p className="headline2 font-weight-normal">
            Read about other previous events in our{" "}
            <a
              className="headline2 font-weight-normal"
              href={window.BLOG_URL}
              target="_blank"
            >
              blog
            </a>
            , or other events that are coming up{" "}
            <a className="headline2 font-weight-normal" href="/events">
              here
            </a>
            .
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
