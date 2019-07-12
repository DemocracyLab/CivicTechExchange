import React from 'react';
import {Button} from 'react-bootstrap';
import {Glyph, GlyphStyles, GlyphSizes} from '../utils/glyphs.js';
import NewsletterSignup from '../common/integrations/NewsletterSignup.jsx';
import url from "../utils/url.js";
import Section from "../enums/Section.js";


class SocialFooter extends React.Component {
  _dlCallToActions() {
    return (
      <div className="SocialFooter-cta SocialFooter-box">
        <p>Welcome to DemocracyLab</p>
        <Button bsClass="btn SocialFooter-btn-contact" href={url.section(Section.ContactUs)}>Contact Us</Button>
        <Button bsClass="btn SocialFooter-btn-donate" href={url.section(Section.Donate)}>Donate</Button>
      </div>
    )
  }
  _socialLinks() {
    return (
      <div className="SocialFooter-followus SocialFooter-box">
        <p>Follow us on</p>
        <div className="SocialFooter-iconblock">
          <a href="https://www.facebook.com/democracylaborg"><i className={Glyph(GlyphStyles.FacebookSquare, GlyphSizes.X3)}></i></a>
          <a href="https://twitter.com/democracylab"><i className={Glyph(GlyphStyles.TwitterSquare, GlyphSizes.X3)}></i></a>
          <a href="https://www.linkedin.com/company/democracylab"><i className={Glyph(GlyphStyles.LinkedIn, GlyphSizes.X3)}></i></a>
          <a href="https://medium.com/democracylab-org"><i className={Glyph(GlyphStyles.Medium, GlyphSizes.X3)}></i></a>
        </div>
      </div>

    )
  }
  _copyrightInfo() {
    return (
      <p className="SocialFooter-copyright">Copyright &copy; 2019 DemocracyLab. All Rights Reserved.</p>
    )
  }

  _newsletterSignup() {
    return (
      <div className="SocialFooter-newsletter SocialFooter-box">
        <p>Subscribe to our newsletter</p>
        <NewsletterSignup />
      </div>
    )
  }

  render() {
    return (
      <div className="SocialFooter-root">
        <div className="container SocialFooter-container">
          <div className="SocialFooter-row">
              {this._dlCallToActions()}
              {this._socialLinks()}
              {this._newsletterSignup()}
          </div>
            <div className="SocialFooter-bottom">
              {this._copyrightInfo()}
            </div>
        </div>
      </div>
    )
  }
}

export default SocialFooter
