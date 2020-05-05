// @flow

import React from 'react';
import CurrentUser from "../utils/CurrentUser.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section";
import _ from "lodash";

class LiveEventController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      !CurrentUser.isLoggedIn()
        ? <LogInController prevPage={Section.LiveEvent}/>
        : (
          <div className="LiveEvent-root">
            <iframe src={_.unescape(window.QIQO_IFRAME_URL)} width="100%" height="800" />
          </div>
        )
    );
  }
}

export default LiveEventController;
