import React from "react";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import NewsletterSignup from "../common/integrations/NewsletterSignup.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import cdn from "../utils/cdn.js";

const sectionsToHideFooter: $ReadOnlyArray<string> = [Section.LiveEvent];

class SiteFooter extends React.Component {
  _footerTopSection() {
    return (
      <div className="SiteFooter-nav col-sm-12 col-lg-8">
        <div className="SiteFooter-nav-links">
          <div className="SiteFooter-logo">
            <img src={cdn.image("favicon.png")} alt="DemocracyLab logo" />
          </div>
          <div className="SiteFooter-link-group">
            <a href="">About</a>
            <a href="">Contact Us</a>
            <a href="">Donate</a>
            <a href="">Partner with Us</a>
          </div>
          <div className="SiteFooter-link-group">
            <a href="">Volunteer</a>
            <a href="">Create a Project</a>
            <a href="">Find an Event</a>
          </div>
          <div className="SiteFooter-link-group">
            <a href="">Privacy Policy</a>
            <a href="">Terms of Use</a>
          </div>
        </div>
      </div>
    );
  }

  _footerMidSection() {
    return (
      <React.Fragment>
        <div className="SiteFooter-social col-sm-12 col-lg-4">
          <div className="Footer-dividerline d-lg-none"></div>
          <div className="SiteFooter-mid-container">
            <div className="SiteFooter-newsletter">
              <p>Stay in the loop with our newsletter</p>
              <NewsletterSignup btnClass="btn btn-primary" />
            </div>

            <div className="Footer-dividerline d-lg-none"></div>

            <div className="SiteFooter-iconblock">
              <a href="https://www.facebook.com/democracylaborg">
                <i
                  className={Glyph(GlyphStyles.FacebookSquare, GlyphSizes.X2)}
                ></i>
              </a>
              <a href="https://twitter.com/democracylab">
                <i
                  className={Glyph(GlyphStyles.TwitterSquare, GlyphSizes.X2)}
                ></i>
              </a>
              <a href="https://www.linkedin.com/company/democracylab">
                <i className={Glyph(GlyphStyles.LinkedIn, GlyphSizes.X2)}></i>
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  _footerBottomSection() {
    return (
      <div className="SiteFooter-copyright col-12">
        <div className="Footer-dividerline SiteFooter-sectionline d-none d-lg-block"></div>
        <div className="SiteFooter-copyright-icons">
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            <i
              className={Glyph(GlyphStyles.CreativeCommons, GlyphSizes.X2)}
            ></i>
            <i
              className={Glyph(GlyphStyles.CreativeCommonsBy, GlyphSizes.X2)}
            ></i>
          </a>
        </div>
        <p className="overline">
          This work by{" "}
          <a
            href="https://www.democracylab.org/"
            property="cc:attributionName"
            rel="cc:attributionURL"
          >
            DemocracyLab
          </a>{" "}
          is licensed under a{" "}
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            Creative Commons Attribution 4.0 International License
          </a>
          .
        </p>
        <p className="overline">
          &copy; 2006-2022 DemocracyLab | All Rights Reserved
        </p>
      </div>
    );
  }

  render(): ?React$Node {
    return (
      !_.some(sectionsToHideFooter, section => url.atSection(section)) && (
        <footer className="SiteFooter-root">
          <div className="container">
            <div className="row">
              {this._footerTopSection()}
              {this._footerMidSection()}
              {this._footerBottomSection()}
            </div>
          </div>
        </footer>
      )
    );
  }
}

export default SiteFooter;
