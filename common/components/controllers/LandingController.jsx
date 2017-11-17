import cx from '../utils/cx';
import React from 'react';

class LandingController extends React.Component {

  constructor() {
    super();
    this._cx = new cx('LandingController-');
  }

  render() {
    return (
      <div>
        {this._renderSupremeCourt()}
        {this._renderFooter()}
      </div>
    );
  }

  _renderSupremeCourt() {
    return (
      <div className={this._cx.get('supremeCourtBanner')}>
        <div
          className={this._cx.get('landingTextContainer', 'centerer')}
          >
          <p
            className={this._cx.get('landingText', 'useYourSkills')}
            >
            Use your skills to make a difference and
            change the world, one project at a time.
          </p>
          <p
            className={this._cx.get('landingText', 'letsGetStarted')}
            >
              {"LET'S GET STARTED."}
            </p>
          <div
            className={this._cx.get('centerer', 'signUpContainer')}
            >
            <div
              className={this._cx.get('landingText', 'signUp')}
              >
              Sign Up
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderFooter() {
    return (
      <div className="LandingController-footer">
        HELP . BLOG . TWITTER . TERMS & RISKS
      </div>
    )
  }
}

export default LandingController;
