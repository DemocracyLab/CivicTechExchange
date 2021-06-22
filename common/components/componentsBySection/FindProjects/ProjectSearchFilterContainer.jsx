// @flow
import React from "react";
import ProjectSearchBar from "./ProjectSearchBar.jsx";
import ProjectSearchSort from "./ProjectSearchSort.jsx";

class ProjectSearchFilterContainer<T> extends React.PureComponent<
  Props<T>,
  State
> {
  render(): React$Node {
    return (
      <div className="ProjectSearchFilterContainer-root col-12">
        <div className="d-none d-lg-block">
          <ProjectSearchSort />{" "}
          {/* this may need to be reworked, it's close but not quite */}
        </div>
        <div className="d-block d-lg-none">
          <ProjectSearchBar />{" "}
          {/*investigate intention of search-as-you-type behavior when calling this directly */}
        </div>

        <p>
          filter bar component goes here: Issue Areas, Skills Needed,
          Technologies Used, Project Stage, Organization, Location
        </p>

        <p>selected filter bar conditionally renders here</p>
      </div>
    );
  }
}

export default ProjectSearchFilterContainer;
