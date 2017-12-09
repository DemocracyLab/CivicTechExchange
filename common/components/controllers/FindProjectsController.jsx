// @flow

import ProjectSearchDispatcher from '../stores/ProjectSearchDispatcher.js';
import TagDispatcher from '../stores/TagDispatcher.js';
import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/FindProjects/ProjectSearchContainer.jsx';
import React from 'react';

class FindProjectsController extends React.PureComponent<{||}> {

  componentWillMount(): void {
    ProjectSearchDispatcher.dispatch({type: 'INIT'});
    TagDispatcher.dispatch({type: 'INIT'});
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
