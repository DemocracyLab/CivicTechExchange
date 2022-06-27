// @flow

import React from "react";
import JumpAnchor from "../common/JumpAnchor.jsx";
import { TermsUse, TermsVolunteer } from "../common/confirmation/TermsText.jsx";

class TermsController extends React.PureComponent<{||}> {
  render(): $React$Node {
    return (
      <div className="container Terms-root">
        <div className="row">
          <div className="col-12">
            <h1>DemocracyLab Terms and Conditions</h1>
            <h2>Table of Contents</h2>
            <ul>
              <li>
                <a href="#use">Terms of Use</a>
              </li>
              <li>
                <a href="#volunteer">Terms of Volunteering</a>
              </li>
            </ul>
            <div className="Terms-section">
              <JumpAnchor id="use" />
              <h3>Terms of Use</h3>
              <TermsUse />
            </div>
            <div className="Terms-section">
              <JumpAnchor id="volunteer" />
              <h3>Terms of Volunteering</h3>
              <TermsVolunteer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TermsController;
