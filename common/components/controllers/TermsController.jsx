// @flow

import React from "react";


class TermsController extends React.PureComponent<{||}> {
  render(): $React$Node {
    return (
      <div className="container privacy-root">
        <div className="row">
          <div className="col-12">
            <h1>DemocracyLab Terms and Conditions</h1>
            <h3>Table of Contents</h3>
            <ul>
                <li>Terms of Volunteering</li>
                <li>Terms of Use</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TermsController;
