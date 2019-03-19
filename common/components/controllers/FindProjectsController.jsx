// @flow

import ProjectSearchDispatcher from '../stores/ProjectSearchDispatcher.js';
import TagDispatcher from '../stores/TagDispatcher.js';
import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectFilterContainer from '../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx';
import {FindProjectsArgs} from "../stores/ProjectSearchStore.js";
import SplashScreen from "../componentsBySection/FindProjects/SplashScreen.jsx";
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
    const args = urls.arguments(document.location.search);
    const searchArgs: FindProjectsArgs = _.pick(args, ['keyword','sortField','location','issues','tech', 'role', 'org', 'stage']);
    ProjectSearchDispatcher.dispatch({type: 'INIT', findProjectsArgs: !_.isEmpty(searchArgs) ? searchArgs : null});
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
        {this.state.showSplash ? <SplashScreen onClickFindProjects={this._onClickFindProjects.bind(this)}/> : null}
        <div className="FindProjectsController-root container">
          <div className="row">
            <ProjectFilterContainer />
            <ProjectCardsContainer />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FindProjectsController;
