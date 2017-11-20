import ProjectFilterContainer from './ProjectFilterContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import React from 'react';

class ProjectSearchContainer extends React.PureComponent {
  render() {
    return (
      <div>
        <ProjectSearchBar onSubmitKeyword={this.props.onSubmitKeyword}/>
        <ProjectFilterContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
