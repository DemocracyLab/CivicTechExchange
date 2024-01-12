// @flow

import React from "react";
import cdn, { Images } from "../utils/cdn.js";

class ThankYouController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="ThankYou-root container">
        <div className="row">
          <div className="ThankYou-leftImage col-xs-12 col-md-6">
            <img src={cdn.image(Images.THANK_YOU)} />
          </div>
          <div className="ThankYou-rightColumn col-xs-12 col-md-6">
            <h2>Thank you for your support!</h2>
            <p>
              Thank you for your donation! Your support will help us continue to
              build our platform to help technology projects that serve the
              public good. Please consider sharing your donation on social
              media, and please make sure you’re signed up for our newsletter to
              stay informed about our work.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankYouController;
