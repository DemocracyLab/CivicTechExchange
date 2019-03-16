// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import cdn from "../utils/cdn.js";
import url from '../utils/url.js'
import Section from '../enums/Section.js'

type Props = {|

|};

type State = {|
|}

class EmailVerifiedController extends React.Component<Props, State> {
  constructor(): void {
    super();
  }
  
  render(): React$Node {
    return (
      <div className="EmailVerifiedController-root">
        <img
          className="EmailVerifiedController-logo"
          src="/static/images/projectPlaceholder.png"
          //src={cdn.image("dl_logo.png")}
        />
        <h2>Your email has been verified</h2>
        <p className="EmailVerifiedController-subhead">Get started by finding tech-for-good projects that match your skill and interests.</p>
        <a className="EmailVerified-find-projects-btn btn btn-default"href={url.section(Section.FindProjects, {showSplash: 1})}>
        FIND PROJECTS
        </a>
      </div>
    );
  }
}

export default EmailVerifiedController;
