import ProjectSearchContainer from '../componentsBySection/ProjectSearchContainer.jsx';
import React from 'react';

class FindProjectsController extends React.Component {
  render() {
    return (
      <div className="FindProjectsController-root">
        <ProjectSearchContainer />
      </div>
    );
  }
}

export default FindProjectsController;
