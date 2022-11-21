// @flow

import React from "react";
import metrics from "../utils/metrics.js";
import { APIError } from "../utils/api.js";
import url from "../utils/url.js";
import LoadingFrame from "../chrome/LoadingFrame.jsx";
import type { EventProjectAPIDetails } from "../utils/EventProjectAPIUtils.js";
import AboutProjectEventDisplay from "../common/event_projects/AboutProjectEventDisplay.jsx";
import EventProjectAPIUtils from "../utils/EventProjectAPIUtils.js";

type State = {|
  eventProject: ?EventProjectAPIDetails,
  loadStatusMsg: string,
  statusCode: string,
|};

class AboutEventProjectController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      eventProject: null,
      loadStatusMsg: "Loading...",
    };
  }

  componentDidMount() {
    const eventId: string = url.argument("event_id");
    const projectId: string = url.argument("project_id");
    EventProjectAPIUtils.fetchEventProjectDetails(
      eventId,
      projectId,
      this.loadEventProjectDetails.bind(this),
      this.handleLoadProjectFailure.bind(this)
    );
  }

  loadEventProjectDetails(eventProject: EventProjectAPIDetails) {
    this.setState({
      eventProject: eventProject,
    });
    metrics.logNavigateToEventProjectProfile(eventProject.event_project_id);
  }

  handleLoadProjectFailure(error: APIError) {
    this.setState({
      loadStatusMsg: "Could not load event project",
      statusCode: "404",
    });
  }

  render(): $React$Node {
    return this.state.eventProject
      ? this._renderDetails()
      : this._renderLoading();
  }

  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        <AboutProjectEventDisplay
          eventProject={this.state.eventProject}
        />
      </React.Fragment>
    );
  }
  _renderLoading(): React$Node {
    return this.state.statusCode
      ? this._renderLoadErrorMessage()
      : this._renderLoadingSpinner();
  }

  _renderLoadErrorMessage(): React$Node {
    return (
      <React.Fragment>
        {this._renderStatusCodeHeader()}
        <div>{this.state.loadStatusMsg}</div>
      </React.Fragment>
    );
  }

  _renderLoadingSpinner(): React$Node {
    return <LoadingFrame height="90vh" />;
  }

  _renderStatusCodeHeader(): React$Node {}
}

export default AboutEventProjectController;
