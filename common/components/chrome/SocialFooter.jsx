import React from "react";
import Button from "react-bootstrap/Button";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import NewsletterSignup from "../common/integrations/NewsletterSignup.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";

const sectionsToHideFooter: $ReadOnlyArray<string> = [Section.LiveEvent];

class SocialFooter extends React.Component {
  _dlCallToActions() {
    return (
      <div className="SocialFooter-cta SocialFooter-box">
        <p>Welcome to DemocracyLab</p>
        <Button
          className="btn btn-footer"
          href={url.section(Section.ContactUs)}
        >
          Contact Us
        </Button>
        <Button className="btn btn-footer" href={url.section(Section.Donate)}>
          Donate
        </Button>
      </div>
    );
  }
  _socialLinks() {
    return (
      <div className="SocialFooter-followus SocialFooter-box">
        <p>Follow us on</p>
        <div className="SocialFooter-iconblock">
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
      </div>
    );
  }
  _copyrightInfo() {
    return (
      <p className="SocialFooter-copyright">
        <a
          className="SocialFooter-copyright-icons"
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
      <div className="SocialFooter-newsletter SocialFooter-box">
        <p>Subscribe to our newsletter</p>
        <NewsletterSignup btnClass="btn btn-footer" />
      </div>
    );
  }

  render(): ?React$Node {
    return (
      !_.some(sectionsToHideFooter, section => url.atSection(section)) && (
        <div className="SocialFooter-root">
          <div className="container SocialFooter-container">
            <div className="SocialFooter-row">
              {this._dlCallToActions()}
              {this._socialLinks()}
              {this._newsletterSignup()}
            </div>
            <div className="SocialFooter-bottom">{this._copyrightInfo()}</div>
          </div>
        </div>
      )
    );
  }
}

export default SocialFooter;
