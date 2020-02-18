// @flow

import Button from 'react-bootstrap/Button';
import ProjectSearchDispatcher from '../stores/ProjectSearchDispatcher.js';
import TagDispatcher from '../stores/TagDispatcher.js';
import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectFilterContainer from '../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx';
import {FindProjectsArgs} from "../stores/ProjectSearchStore.js";
import SplashScreen from "../componentsBySection/FindProjects/SplashScreen.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import urls from "../utils/url.js";
import React from 'react';
import _ from 'lodash'

type State = {|
  showSplash: boolean
|};

class FindProjectsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {showSplash: true};
  }

  componentWillMount(): void {
    let args: FindProjectsArgs = urls.arguments(document.location.search);
    args = _.pick(args, ['showSplash','keyword','sortField','location','page','issues','tech', 'role', 'org', 'stage']);
    ProjectSearchDispatcher.dispatch({type: 'INIT', findProjectsArgs: !_.isEmpty(args) ? args : null});
    TagDispatcher.dispatch({type: 'INIT'});
    this.setState({showSplash: args.showSplash});
  }

  _onClickFindProjects(): void {
    this.setState({showSplash: false});
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="DemocracyLab"
          description="Optimizing the connection between skilled volunteers and tech-for-good projects"
        />
        {this.state.showSplash ? this._renderSplash() : null}
        <div className="FindProjectsController-root container">
          <div className="row">
            <ProjectFilterContainer />
            <ProjectCardsContainer />
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderSplash(): React$Node {
    const header: string = "We connect skilled volunteers and tech-for-good projects";
    const bottomOverlayLines: $ReadOnlyArray<string> = [
      "DemocracyLab is a nonprofit organization.",
      "Our mission is to empower people who use technology to advance the public good."
    ];

    return (
      <SplashScreen header={header} bottomOverlayText={bottomOverlayLines}>
        <Button variant="primary" className="SplashScreen-find-projects-btn" onClick={this._onClickFindProjects.bind(this)}>
          Find Projects
        </Button>
        <Button variant="primary" className="SplashScreen-create-project-btn" href={urls.sectionOrLogIn(Section.CreateProject)}>
          Create A Project
        </Button>
      </SplashScreen>
    );
  }
}

export default FindProjectsController;
