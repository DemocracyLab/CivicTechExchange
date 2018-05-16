// @flow

import IssueAreasFilter from './IssueAreasFilter.jsx';
import React from 'react';
import TagSelectorDropdown from "../../common/tags/TagSelectorDropdown.jsx";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import TagCategory from "../../common/tags/TagCategory.jsx";
import SelectorDropdown from "../../common/selection/SelectorDropdown.jsx";

class ProjectFilterContainer extends React.PureComponent<{||}> {

  // TODO: Remove SelectorDropdown test code before release
  handleStuff(stuff) {
    let debug = 1 + 1;
  }
  
  renderStuff(stuff) {
    return stuff.text;
  }
  
  render(): React$Node {
    const testStuff = [
      {id: 1, text:"AAAAAAA", disabled:false, category:"Vowel"},
      {id: 1, text:"BBBBBBB", disabled:false, category:"Consonant"},
      {id: 1, text:"CCCCCCC", disabled:true, category:"Consonant"},
      {id: 1, text:"DDDDDDD", disabled:true, category:"Consonant"},
    ];
    
    return (
      <div className="ProjectFilterContainer-root">
        <span className="ProjectFilterContainer-label">
          Filter By:
        </span>
        {/*<IssueAreasFilter />*/}
        <TagSelectorDropdown category={TagCategory.ISSUES} title="Issue Areas" />
        <SelectorDropdown
          title="Test Dropdown"
          options={testStuff}
          optionDisplay={this.renderStuff}
          onOptionSelect={this.handleStuff}
          optionEnabled={(stuff) => !stuff.disabled}
          optionCategory={(stuff) => stuff.category}
        />
      </div>
    );
  }
}

export default ProjectFilterContainer;
