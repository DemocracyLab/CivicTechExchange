import React from 'react';

class LandingController extends React.Component {
  render() {
    return (
      <div>
        <div className="LandingController-supremeCourtBanner">
          <div className="LandingController-landingTextContainer">
            <p className="LandingController-landingText">
              Use your skills to make a difference and change the world,
              one project at a time.
            </p>
            <p className="LandingController-landingText">{"LET'S GET STARTED."}</p>
            <button className="LandingController-landingText">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingController;
