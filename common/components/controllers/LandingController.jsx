// @flow

import React from 'react';
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";

class LandingController extends React.PureComponent<{||}> {

  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div>
        {this._renderTopSplash()}
        {this._renderBottomSplash()}
      </div>
    );
  }
  
  
  _renderTopSplash(): React$Node {
    const header: string = "Make Tech.  Do Good.";
    const text: string = "We connect skilled volunteers and tech-for-good projects";
    
    return (
      <SplashScreen header={header} text={text} img={HeroImage.TopLanding}/>
    );
  }
  
  _renderBottomSplash(): React$Node {
    const header: string = "What are you waiting for?";
    
    return (
      <SplashScreen header={header} img={HeroImage.BottomLanding}/>
    );
  }
  
}
export default LandingController;
