
// @flow
import React from 'react';
import ProjectFilterDataContainer from "./ProjectFilterDataContainer.jsx";
import ResetSearchButton from '../ResetSearchButton.jsx';
import metrics from "../../../utils/metrics.js";

class ProjectFilterContainer<T> extends React.PureComponent<Props<T>, State> {

  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root col-12 col-md-3 col-xxl-2">
        <ProjectFilterDataContainer />
      </div>
    );
  }
}

export default ProjectFilterContainer;
