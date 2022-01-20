// @flow

import React from "react";
import cdn, { Images } from "../utils/cdn.js";
import url from "../utils/url.js";
import Section from "../enums/Section.js";

class EmailVerifiedController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="EmailVerifiedController-root container text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10">
            <div className="EmailVerifiedController-logo">
              <img src={cdn.image(Images.DL_GLYPH)} />
            </div>
            <div className="EmailVerifiedController-greeting">
              <h3>Your email has been verified</h3>
              <p>
                Get started by finding tech-for-good projects that match your
                skill and interests.
              </p>
              <a
                className="btn btn-primary"
                href={url.section(Section.FindProjects)}
              >
                Find Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailVerifiedController;
