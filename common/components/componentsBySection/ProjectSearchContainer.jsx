import ProjectSearchBar from './ProjectSearchBar.jsx';
import React from 'react';

class ProjectSearchContainer extends React.Component {
  render() {
    return (
      <div>
        <ProjectSearchBar onSubmitKeyword={this.props.onSubmitKeyword}/>
      </div>
    );
  }
}

export default ProjectSearchContainer;
