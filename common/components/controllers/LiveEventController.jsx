// @flow

import React from "react";
import CurrentUser from "../utils/CurrentUser.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import urlHelper from "../utils/url.js";
import _ from "lodash";

type State = {|
  iframeUrl: string,
|};

class LiveEventController extends React.Component<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      iframeUrl: window.QIQO_IFRAME_URL,
    };
  }

  render(): React$Node {
    return !CurrentUser.isLoggedIn() ? (
      <LogInController prevPage={Section.LiveEvent} />
    ) : (
      <div className="LiveEvent-root">
        <iframe
          src={_.unescape(this.state.iframeUrl)}
          allow="camera *;microphone *"
        />
      </div>
    );
  }
}

export default LiveEventController;
