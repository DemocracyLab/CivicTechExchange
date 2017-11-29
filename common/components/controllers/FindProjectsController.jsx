// @flow


import ProjectSearchDispatcher from '../stores/ProjectSearchDispatcher.js';
import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/FindProjects/ProjectSearchContainer.jsx';
import React from 'react';

class FindProjectsController extends React.PureComponent<{||}> {

  componentWillMount(): void {
    // load up all the projects by "filtering" without a keyword
    ProjectSearchDispatcher.dispatch({type: 'FILTER_BY_KEYWORD'});
  }

  render(): React$Node {
    return (
      <div className="FindProjectsController-root">
        <ProjectSearchContainer />
        <ProjectCardsContainer />
      </div>
    );
  }
}

export default FindProjectsController;
