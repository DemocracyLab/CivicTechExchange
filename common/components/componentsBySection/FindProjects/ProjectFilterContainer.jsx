// @flow

import IssueAreasFilter from './IssueAreasFilter.jsx';
import React from 'react';

class ProjectFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root">
        <span className="ProjectFilterContainer-label">
          Filter Search:
        </span>
        <IssueAreasFilter />
      </div>
    );
  }
}

export default ProjectFilterContainer;
