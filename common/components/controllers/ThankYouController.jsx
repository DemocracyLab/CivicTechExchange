// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import Headers from "../common/Headers.jsx";

class ThankYouController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="ThankYou-root">

        <div className="ThankYou-leftImage">
          <img src={cdn.image(Images.THANK_YOU)}/>
        </div>

        <div className="ThankYou-rightColumn">

          <div className="ThankYou-message">
            <h2>Thanks for your support!</h2>
            <p>Your donation supports the valuable work of our organization. Thank you for your donation.</p>
          </div>

          <div className="ThankYou-share">
            <h3>Share with your friends</h3>
          </div>

        </div>
      </div>
    );
  }
}

export default ThankYouController;
