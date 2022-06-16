import React from "react";
import Button from "react-bootstrap/Button";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import NewsletterSignup from "../common/integrations/NewsletterSignup.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";

const sectionsToHideFooter: $ReadOnlyArray<string> = [Section.LiveEvent];

class SiteFooter extends React.Component {
  _socialLinks() {
    return (
      <div className="SiteFooter-iconblock">
        <a href="https://www.facebook.com/democracylaborg">
          <i className={Glyph(GlyphStyles.FacebookSquare, GlyphSizes.X3)}></i>
        </a>
        <a href="https://twitter.com/democracylab">
          <i className={Glyph(GlyphStyles.TwitterSquare, GlyphSizes.X3)}></i>
        </a>
        <a href="https://www.linkedin.com/company/democracylab">
          <i className={Glyph(GlyphStyles.LinkedIn, GlyphSizes.X3)}></i>
        </a>
      </div>
    );
  }
  _copyrightInfo() {
    return (
      <p className="SiteFooter-copyright">
        <a
          className="SiteFooter-copyright-icons"
          rel="license"
          href="http://creativecommons.org/licenses/by/4.0/"
        >
          <i className={Glyph(GlyphStyles.CreativeCommons, GlyphSizes.X2)}></i>
          <i
            className={Glyph(GlyphStyles.CreativeCommonsBy, GlyphSizes.X2)}
          ></i>
        </a>
        <br />
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
    );
  }

  _newsletterSignup() {
    return (
      <div className="SiteFooter-newsletter">
        <p>Stay in the loop with our newsletter</p>
        <NewsletterSignup btnClass="btn btn-footer" />
      </div>
    );
  }

  render(): ?React$Node {
    return (
      !_.some(sectionsToHideFooter, section => url.atSection(section)) && (
        <div className="SiteFooter-root">
          <div className="container">
            {this._socialLinks()}
            {this._newsletterSignup()}
          </div>
          <div className="SiteFooter-bottom">{this._copyrightInfo()}</div>
        </div>
      )
    );
  }
}

export default SiteFooter;
