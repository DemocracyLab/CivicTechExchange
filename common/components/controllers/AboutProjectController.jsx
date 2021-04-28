// @flow

import React from "react";
import Helmet from "react-helmet";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import type { ProjectDetailsAPIData } from "../utils/ProjectAPIUtils.js";
import metrics from "../utils/metrics.js";
import Headers from "../common/Headers.jsx";
import Truncate from "../utils/truncate.js";
import AboutProjectDisplay from "../common/projects/AboutProjectDisplay.jsx";
import { APIError } from "../utils/api.js";
import url from "../utils/url.js";
import prerender from "../utils/prerender.js";
import LoadingFrame from "../chrome/LoadingFrame.jsx";

type State = {|
  project: ?ProjectDetailsAPIData,
  loadStatusMsg: string,
  statusCode: string,
|};

class AboutProjectController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      project: null,
      loadStatusMsg: "Loading...",
    };
  }

  componentDidMount() {
    const projectId: string = url.argument("id");
    ProjectAPIUtils.fetchProjectDetails(
      projectId,
      this.loadProjectDetails.bind(this),
      this.handleLoadProjectFailure.bind(this)
    );
    metrics.logNavigateToProjectProfile(projectId);
  }

  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState(
      {
        project: project,
      },
      prerender.ready
    );
  }

  handleLoadProjectFailure(error: APIError) {
    this.setState({
      loadStatusMsg: "Could not load project",
      statusCode: "404",
    });
  }

  render(): $React$Node {
    return this.state.project ? this._renderDetails() : this._renderLoading();
  }

  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        <AboutProjectDisplay project={this.state.project} viewOnly={false} />
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

  _renderStatusCodeHeader(): React$Node {
    return (
      this.state.statusCode && (
        <React.Fragment>
          <Helmet>
            <meta
              name="prerender-status-code"
              content={this.state.statusCode}
            />
          </Helmet>
        </React.Fragment>
      )
    );
  }
}

export default AboutProjectController;
