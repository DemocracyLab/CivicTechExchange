import React from 'react';

class SocialFooter extends React.Component {

  _dlCallToActions() {
    return (
      <p>Welcome to DemocracyLab</p>
    )
  }
  _socialLinks() {
    return (
      <p>Join us on social media somewhere....</p>
    )
  }
  _copyrightInfo() {
    return (
      <p>Copyright &copy; 2019 DemocracyLab. All Rights Reserved.</p>
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
      <div className="SocialFooter-root container-fluid">
        <div className="bounded-content">
          {this._dlCallToActions}
          {this._socialLinks}
          {this._copyrightInfo}
          {this._footerNavigation}
          {this._newsletterSignup}
        </div>
      </div>
    )
  }
}

export default SocialFooter
