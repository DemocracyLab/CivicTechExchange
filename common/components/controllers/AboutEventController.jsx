// @flow

import React from "react";
import Helmet from "react-helmet";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import type { ProjectDetailsAPIData } from "../utils/ProjectAPIUtils.js";
import metrics from "../utils/metrics.js";
import Headers from "../common/Headers.jsx";
import Truncate from "../utils/truncate.js";
import AboutProjectDisplay from "../common/projects/AboutProjectDisplay.jsx";
import LoadingFrame from "../chrome/LoadingFrame.jsx";
import { APIError } from "../utils/api.js";
import url from "../utils/url.js";
import EventAPIUtils, { EventData } from "../utils/EventAPIUtils.js";
import AboutEventDisplay from "../componentsBySection/CreateEvent/AboutEventDisplay.jsx";

type State = {|
  event: ?EventData,
  loadStatusMsg: string,
  statusCode: string,
|};

class AboutEventController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      project: null,
      loadStatusMsg: "Loading...",
    };
  }

  componentDidMount() {
    const projectId: string = url.argument("id");
    EventAPIUtils.fetchEventDetails(
      projectId,
      this.loadEventDetails.bind(this),
      this.handleLoadEventFailure.bind(this)
    );
  }

  loadEventDetails(event: EventData) {
    this.setState({
      event: event,
    });
  }

  handleLoadEventFailure(error: APIError) {
    this.setState({
      loadStatusMsg: "Could not load Event",
      statusCode: "404",
    });
  }

  render(): $React$Node {
    return this.state.event ? this._renderDetails() : this._renderLoadMessage();
  }

  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        {this._renderEventHeader(this.state.event)}
        <AboutEventDisplay event={this.state.event} viewOnly={false} />
      </React.Fragment>
    );
  }

  _renderEventHeader(event: EventData): React$Node {
    const title: string = event.event_name + " | DemocracyLab";
    const description: string = event.event_short_description;

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={event.event_thumbnail && event.event_thumbnail.publicUrl}
      />
    );
  }

  _renderLoadMessage(): React$Node {
    return <LoadingFrame height="80vh" />;
  }
}

export default AboutEventController;
