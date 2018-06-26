// @flow

import React from 'react';
import TagSelectorDropdown from "../../common/tags/TagSelectorDropdown.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";

class ProjectFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root">
        <div className="ProjectFilterContainer-label">
          Filter By:
        </div>
        <TagSelectorDropdown category={TagCategory.ISSUES} title="Issue Areas" />
        <TagSelectorDropdown category={TagCategory.TECHNOLOGIES_USED} title="Technology Used" />
        <TagSelectorDropdown category={TagCategory.ROLE} title="Roles Needed" />
        <TagSelectorDropdown category={TagCategory.ORGANIZATION} title="Communities" />
      </div>
    );
  }
}

export default ProjectFilterContainer;
