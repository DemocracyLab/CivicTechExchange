// @flow

import ProjectFilterContainer from './ProjectFilterContainer.jsx';
import ProjectTagContainer from './ProjectTagContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import DiscoverPageDescription from './DiscoverPageDescription.jsx';
import React from 'react';

class ProjectSearchContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div>
      	<DiscoverPageDescription />
        <ProjectSearchBar />
        <ProjectTagContainer />
        <ProjectFilterContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
