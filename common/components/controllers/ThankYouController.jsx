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
        Thanks for your donation!
      </div>
    );
  }
}

export default ThankYouController;
