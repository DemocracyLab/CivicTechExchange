// @flow

import ProjectFilterContainer from './ProjectFilterContainer.jsx';
import ProjectSearchBar from './ProjectSearchBar.jsx';
import React from 'react';

type Props = {|
  +onSubmitKeyword: (string) => void,
|};

class ProjectSearchContainer extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div>
        <ProjectSearchBar onSubmitKeyword={this.props.onSubmitKeyword}/>
        <ProjectFilterContainer />
      </div>
    );
  }
}

export default ProjectSearchContainer;
