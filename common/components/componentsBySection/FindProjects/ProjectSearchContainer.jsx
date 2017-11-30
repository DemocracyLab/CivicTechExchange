// @flow

import ProjectFilterContainer from './ProjectFilterContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import React from 'react';

class ProjectSearchContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div>
        <ProjectSearchBar />
        <ProjectFilterContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
