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
        <div>
          picture
          <img src={cdn.image(Images.THANK_YOU)}/>
        </div>

        <div>
          <h2>Thanks for your support!</h2>
          <p>Your donation supports the valuable work of our organization. Thank you for your donation.</p>
        </div>

        <div>
          <h3>Share with your friends</h3>
        </div>

      </div>
    );
  }
}

export default ThankYouController;
