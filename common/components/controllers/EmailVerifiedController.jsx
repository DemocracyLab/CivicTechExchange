// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import url from '../utils/url.js'
import Section from '../enums/Section.js'

class EmailVerifiedController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="EmailVerifiedController-root">
        <div className="EmailVerifiedController-logo">
          <img src={cdn.image(Images.DL_GLYPH)}/>
        </div>
        <div className="EmailVerifiedController-greeting">
          <h3>Your email has been verified</h3>
          <p>Get started by finding tech-for-good projects that match your skill and interests.</p>
          <a className="EmailVerified-find-projects-btn btn-secondary" href={url.section(Section.FindProjects, {showSplash: 1})}>
            FIND PROJECTS
          </a>
        </div>
      </div>
    );
  }
}

export default EmailVerifiedController;
