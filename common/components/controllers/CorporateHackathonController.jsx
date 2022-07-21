// democracylab.org/companies page --- TODO: rename controller

// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import url from "../utils/url.js";
import Sponsors, { SponsorMetadata } from "../utils/Sponsors.js";
import cdn from "../utils/cdn.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TestimonialCarousel from "../../components/common/carousel/TestimonialCarousel.jsx";
import ContactForm from "../../components/forms/ContactForm.jsx";
import JumpAnchor from "../common/JumpAnchor.jsx";
import _ from "lodash";
import IconCircle1 from "../svg/corporatehackathon/Discover.svg";
import IconCircle2 from "../svg/corporatehackathon/ConnectionCircle.svg";
import IconCircle3 from "../svg/corporatehackathon/Code.svg";
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
          <div className="corporate-top col-12 corporate-bg-light">
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
              title="Sponsor Our Platform & Public Events"
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
            <div className="col-12 corporate-card-container">
              <div className="corporate-card">
                <h2>Engage your team and give back to your community</h2>
                <p>
                  Strengthen employee enthusiasm, participate in meaningful
                  projects, and instill a sense of purpose.
                </p>
                <p>
                  73% of our corporate hackathon participants reported an
                  increase in enthusiasm for working at their company.
                </p>
              </div>
              <div className="corporate-card">
                <h2>Drive performance</h2>
                <p>
                  Spur innovation and turn your culture of purpose into
                  bottom-line results.
                </p>
                <p>
                  91% of executives and employees correlate a sense of purpose
                  with a history of strong financial performance. (
                  <a
                    href="https://www2.deloitte.com/us/en/pages/about-deloitte/articles/culture-of-purpose.html"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Deloitte
                  </a>
                  )
                </p>
              </div>
              <div className="corporate-card">
                <h2>Enjoy a significant return on investment</h2>
                <p>
                  Increased employee enthusiasm and engagement leads to lower
                  turnover rates and higher profitability.
                </p>
                <p>
                  Highly engaged teams realize 59% less turnover and 21% greater
                  profitability. (
                  <a
                    href="https://www.gallup.com/workplace/236366/right-culture-not-employee-satisfaction.aspx"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Gallup
                  </a>
                  )
                </p>
              </div>
            </div>
            <div className="col-12 corporate-learn-more">
              <h4>Learn more: {this._renderHackathonProspectus()}</h4>
              <Button
                variant="primary"
                href="#contact-hackathon"
                className="corporate-block-button"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* this button jumps down to the contact form FOR the hackathon section, see issue #820 */}
        </div>
        <div className="corporate-hackathon-howitworks corporate-bg-light col-12">
          <h1>How it works:</h1>
          <h2>
            We do the heavy lifting. Your employees make an impact. Your
            organization thrives.
          </h2>
          <div className="corporate-how-flex-container">
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle1 />
              </div>
              <div className="corporate-how-text-container">
                <div className="corporate-how-text">
                  <h3>1. Discover</h3>
                  <p>
                    We find tech-for-good projects that are a good fit for your
                    team.
                  </p>
                </div>
              </div>
            </div>
            <div className="corporate-how-flex-block">
              <div className="corporate-how-image-container">
                <IconCircle2 />
              </div>
              <div className="corporate-how-text">
                <h3>2. Define</h3>
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
                <h3>3. Collaborate</h3>
                <p>
                  Together, we make a positive impact at your tech-for-good
                  hackathon!
                </p>
              </div>
            </div>
          </div>
          <h3 className="corporate-how-after">
            After the event, DemocracyLab reports on the resulting engagement,
            outcomes, and impact.
          </h3>
        </div>

        

        <div className="corporate-hackathon-saying col-12 corporate-bg-light">
          <h1>What our partners are saying.</h1>
          <h2>
            Feedback from our partners about their custom hackathon events.
          </h2>
          <div className="carousel-testimonial-root">
            <TestimonialCarousel
              category="partner-highlights"
              interval={600000}
            />
          </div>
          <p className="h3">
            {/* TODO find where {window.BLOG_URL} is declared */}
            Learn more in our blog <a href="https://blog.democracylab.org/how-amazon-hacked-for-good/">blog</a>
            .
          </p>
        </div>

        {this._renderContactHackathon()}

      </React.Fragment>
    );
  }

  _renderSponsorshipTab(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-sponsorship-why col-12">
          <h1>Why become a sponsor?</h1>
          <div className="row">
            <div className="col-12 corporate-card-container">
              <div className="corporate-card">
                <h2>Make an impact.</h2>
                <p>
                  Your support advances hundreds of tech-for-good projects,
                  helps us grow, and improves our public events.
                </p>
                <p>
                  Every $1,000 contributed enables 500 hours of skilled
                  volunteer work, helping more projects make more of an impact.
                </p>
              </div>
              <div className="corporate-card">
                <h2>Differentiate your company.</h2>
                <p>
                  Supporting DemocracyLab shows your company's commitment to
                  social responsibility.
                </p>
                <p>
                  79% of employees prefer to work at a socially responsible
                  company. (
                  <a
                    href="https://www2.deloitte.com/us/en/pages/about-deloitte/articles/culture-of-purpose.html"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Deloitte
                  </a>
                  )
                </p>
              </div>
              <div className="corporate-card">
                <h2>Attract purpose-minded talent.</h2>

                <p>
                  Connect with skilled tech volunteers who strive to make a
                  difference.
                </p>

                <p>
                  Position your company as an employer of choice for our diverse
                  community of talented volunteers.
                </p>
              </div>
            </div>
            <div className="col-12 corporate-learn-more">
              <h4>Learn more: {this._renderSponsorProspectus()}</h4>
              <Button
                variant="primary"
                href="#contact-sponsor"
                className="corporate-block-button"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="corporate-sponsorship-how corporate-bg-light col-12">
          <h1>Our sponsors make a difference.</h1>

          <h2>
            Your support of DemocracyLab and our events extends your brand reach
            and helps solve challenging problems through public interest
            technology.
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
              <h4>250+</h4>
              <p>Project Teams</p>
            </div>
          </div>
          <h3>
            We offer flexible sponsorship levels so you can get involved at any
            budget.
          </h3>

          <h4>
            In addition to the benefits of each level, all DemocracyLab sponsors
            receive:
          </h4>

          <ul>
            <li>Exposure on the DemocracyLab website</li>

            <li>Branding and involvement at our bimonthly hackathon events</li>

            <li>Impactful, positive PR opportunities for your organization</li>
          </ul>
          <ul className="corporate-sponsorship-learn">
            <li>
              {" "}
              Learn more about our sponsorship levels:{" "}
              {this._renderSponsorProspectus()}
            </li>
          </ul>

          <div className="corporate-sponsorship-current">
            <h4>Current DemocracyLab sponsors include:</h4>
            <div className="corporate-sponsors-container">
              {this._renderCurrentSponsors()}
              <div className="corporate-sponsor-item">
                <img
                  src="https://d1agxr2dqkgkuy.cloudfront.net/img/bill-melinda-gates-foundation.png"
                  alt="Bill and Melinda Gates Foundation logo"
                ></img>
              </div>
            </div>
          </div>
        </div>

        <div className="corporate-sponsorship-saying corporate-bg-light col-12">
          <h1>What our partners are saying.</h1>
          <h2>Feedback from partnering organizations.</h2>

          <div className="carousel-testimonial-root">
            <TestimonialCarousel
              category="hackathon-highlights"
              interval={600000}
            />
          </div>
          <p className="headline2">
            Read about other previous events in our{" "}
            <a href={window.BLOG_URL}>blog</a>, or other events that are coming
            up <a href="/events">here</a>.
          </p>
        </div>

        {this._renderContactSponsor()}
        
      </React.Fragment>
    );
  }
  _renderContactHackathon(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-contact col-12 corporate-bg-light">
          <JumpAnchor id="contact-hackathon" />
          <h1>Interested in hosting your own hackathon?</h1>
          <h2>Get in touch to discuss your next tech-for-good event.</h2>
          <ContactForm interest_hackathon={true} />
          <h4>
            Not ready yet? Learn more: {this._renderHackathonProspectus()}
          </h4>
        </div>
      </React.Fragment>
    );
  }
  _renderHackathonProspectus(): React$Node {
    return (
      <a
        href={cdn.document(
          "2021+DemocracyLab+Corporate+Hackathon+Prospectus.pdf"
        )}
      >
        Corporate Tech-for-Good Hackathons PDF{" "}
        <i className={Glyph(GlyphStyles.PDF, GlyphSizes.X1)}></i>
      </a>
    );
  }
  _renderSponsorProspectus(): React$Node {
    return (
      <a href={cdn.document("2021+DemocracyLab+Sponsorship+Prospectus.pdf")}>
        Sponsor Prospectus PDF{" "}
        <i className={Glyph(GlyphStyles.PDF, GlyphSizes.X1)}></i>
      </a>
    );
  }

  _renderContactSponsor(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-contact col-12 corporate-bg-light">
          <JumpAnchor id="contact-sponsor" />
          <h1>Interested in becoming a sponsor?</h1>
          <h2>Get in touch to make an impact in the tech-for-good movement.</h2>
          <ContactForm interest_sponsor={true} />
          <h4>Not ready yet? Learn more: {this._renderSponsorProspectus()}</h4>
        </div>
      </React.Fragment>
    );
  }
  _renderCurrentSponsors(): React$Node {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    let sdata = sponsors.filter(obj => obj.category !== "In-kind Support");

    if (!_.isEmpty(sdata)) {
      return (
        <React.Fragment>
          {sdata.map((sponsor: SponsorMetadata, i: number) => {
            return (
              <div key={i} className="corporate-sponsor-item">
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="corporate-sponsor-item-link"
                >
                  <img src={sponsor.thumbnailUrl} />
                </a>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  }
}

export default CorporateHackathonController;
