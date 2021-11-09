// @flow
import React from "react";
import ProjectSearchSort from "./ProjectSearchSort.jsx";
import ProjectFilterContainer from "./Filters/ProjectFilterContainer.jsx";
import ProjectTagContainer from "./ProjectTagContainer.jsx";
//this component is the "top section" of our find project page, containing the Search, Filter, and Selected Filters components
class ProjectSearchFilterContainer<T> extends React.PureComponent<
  Props<T>,
  State
> {
  render(): React$Node {
    return (
      <React.Fragment>
        <div className="col-12">
          <ProjectSearchSort />
        </div>
        <div className="col-12">
          <ProjectFilterContainer />
        </div>
        <div className="col-12">
          <ProjectTagContainer />
        </div>
      </React.Fragment>
    );
  }
}

export default ProjectSearchFilterContainer;
