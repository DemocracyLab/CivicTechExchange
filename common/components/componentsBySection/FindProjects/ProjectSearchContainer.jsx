// @flow

import ProjectFilterContainer from './ProjectFilterContainer.jsx';
import ProjectTagContainer from './ProjectTagContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import React from 'react';

class ProjectSearchContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div>
      	<p>
        	Welcome to DemocracyLab! Use the filters and search bar below to find tech-for-good projects in Seattle.
      	</p>
        <ProjectSearchBar />
        <ProjectTagContainer />
        <ProjectFilterContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
