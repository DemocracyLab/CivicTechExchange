import React from 'react';

function css(...classnames) {
  const prefix = 'LandingController-';
  return prefix + classnames.join(' ' + prefix);
}

class LandingController extends React.Component {
  render() {
    return (
      <div>
        <div className={css('supremeCourtBanner')}>
          <div
            className={css('landingTextContainer', 'centerer')}
            >
            <p
              className={css('landingText', 'useYourSkills')}
              >
              Use your skills to make a difference and
              change the world, one project at a time.
            </p>
            <p
              className={css('landingText', 'useYourSkills')}
              >
                {"LET'S GET STARTED."}
              </p>
            <div
              className={css('centerer', 'signUpContainer')}
              >
              <div
                className={css('landingText', 'signUp')}
                >
                Sign Up
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default LandingController;
