// @flow

import cx from '../utils/cx';
import React from 'react';
import MainFooter from "../chrome/MainFooter.jsx";

class LandingController extends React.PureComponent<{||}> {

  _cx: cx;

  constructor(): void {
    super();
    this._cx = new cx('LandingController-');
  }

  render(): React$Node {
    return (
      <div>
        {this._renderSupremeCourt()}
        <MainFooter/>
      </div>
    );
  }

  _renderSupremeCourt(): React$Node {
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
            <a href="/signup">
              <div
                className={this._cx.get('landingText', 'signUp')}
                >
                Sign Up
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default LandingController;
