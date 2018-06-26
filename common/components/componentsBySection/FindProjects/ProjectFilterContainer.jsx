// @flow

import React from 'react';
import TagSelectorCollapsible from "../../common/tags/TagSelectorCollapsible.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";

class ProjectFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root">
        <div className="ProjectFilterContainer-label">
          Filter By:
        </div>
        <TagSelectorCollapsible category={TagCategory.ISSUES} title="Issue Areas" />
        <TagSelectorCollapsible category={TagCategory.TECHNOLOGIES_USED} title="Technology Used" />
        <TagSelectorCollapsible category={TagCategory.ROLE} title="Roles Needed" />
      </div>
    );
  }
}

export default ProjectFilterContainer;
