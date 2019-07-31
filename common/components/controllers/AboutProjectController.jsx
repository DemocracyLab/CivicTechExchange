// @flow

import React from 'react';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import metrics from "../utils/metrics.js";
import Headers from "../common/Headers.jsx";
import Truncate from "../utils/truncate.js";
import AboutProjectDisplay from "../common/projects/AboutProjectDisplay.jsx";
import {APIError} from "../utils/api.js";
import url from "../utils/url.js";


type State = {|
  project: ?ProjectDetailsAPIData,
  loadStatusMsg: stringA
|};

class AboutProjectController extends React.PureComponent<{||}, State> {

  constructor(): void{
    super();
    this.state = {
      project: null,
      loadStatusMsg: "Loading...",
    };
 }

  componentDidMount() {
    const projectId: string = url.argument("id");
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this), this.handleLoadProjectFailure.bind(this));
    metrics.logNavigateToProjectProfile(projectId);
  }

  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      project: project
    });
  }

  handleLoadProjectFailure(error: APIError) {
    this.setState({
      loadStatusMsg: "Could not load project"
    });
  }

  render(): $React$Node {
    return this.state.project ? this._renderDetails() : <div>{this.state.loadStatusMsg}</div>
  }

  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        {this._renderHeader(this.state.project)}
        <AboutProjectDisplay project={this.state.project} viewOnly={false}/>
      </React.Fragment>
    );
  }

  _renderHeader(project: ProjectDetailsAPIData): React$Node {
    const title: string = project.project_name + " | DemocracyLab";
    const description: string = project.project_short_description || Truncate.stringT(project.project_description, 300);

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={project.project_thumbnail && project.project_thumbnail.publicUrl}
      />
    );
  }
}

export default AboutProjectController;
