import React from 'react';
import {Button} from 'react-bootstrap';
import {Glyph, GlyphStyles, GlyphSizes} from '../utils/glyphs.js'


class SocialFooter extends React.Component {

  _dlCallToActions() {
    return (
      <React.Fragment>
        <p>Welcome to DemocracyLab</p>
        <Button bsClass="btn SocialFooter-btn-about" href={`/index/?section=AboutProject&id=${window.DLAB_PROJECT_ID}`}>Join Us</Button>
        <Button bsClass="btn SocialFooter-btn-donate" href="/index/?section=Donate">Donate</Button>
      </React.Fragment>
    )
  }
  _socialLinks() {
    return (
      <React.Fragment>
        <p>Follow us on</p>
        <div className="SocialFooter-iconblock">
          <a href=""><i className={Glyph(GlyphStyles.FacebookSquare, GlyphSizes.X2)}></i></a>
          <a href=""><i className={Glyph(GlyphStyles.TwitterSquare, GlyphSizes.X2)}></i></a>
          <a href=""><i className={Glyph(GlyphStyles.LinkedIn, GlyphSizes.X2)}></i></a>
          <a href=""><i className={Glyph(GlyphStyles.Medium, GlyphSizes.X2)}></i></a>
        </div>
      </React.Fragment>

    )
  }
  _copyrightInfo() {
    return (
      <p className="SocialFooter-copyright">Copyright &copy; 2019 DemocracyLab. All Rights Reserved.</p>
    )
  }
  _footerNavigation() {
    return (
      <p>Footer navigation links go here</p>
    )
  }

  _newsletterSignup() {
    return (
      <p>Sign up for our newsletter!</p>
    )
  }

  render() {
    return (
      <div className="SocialFooter-root">
        <div className="container">
          {this._dlCallToActions()}
          {this._socialLinks()}
          {/* {this._footerNavigation()} */}
          {this._newsletterSignup()}
          {this._copyrightInfo()}
        </div>
      </div>
    )
  }
}

export default SocialFooter
