// @flow

import React from 'react'
import {Container} from 'flux/utils';
import type {TagDefinition} from '../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js';
import SelectorDropdown from "../selection/SelectorDropdown.jsx";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import metrics from "../../utils/metrics";
import _ from 'lodash'

/**
 * @category: Tag category to pull from
 * @title: Title of the dropdown
 */
type Props = {|
  category: string,
  title: string
|};

type State = {|
  tags: ?$ReadOnlyArray<TagDefinition>,
  tagCounts: ?{ [key: string]: number },
  hasSubcategories: boolean
|};

/**
 * Dropdown selector for tags
 */
class TagSelectorDropdown extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {tags: null};
    
    // TODO: Use Flux to get tags in a single request
    ProjectAPIUtils.fetchTagsByCategory(this.props.category, tags => {
      this.setState({
        tags: tags,
        hasSubcategories: _.every(tags, tag => !_.isEmpty(tag.subcategory))
      });
    });
    this._displayTag = this._displayTag.bind(this);
  }
  
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }
  
  static calculateState(prevState: State): State {
    const filters = ProjectSearchStore.getAvailableFilters();
    
    // TODO: Fix this
    return {
      tagCounts: filters && filters.tags
    };
  }
  
  selectTag(tag: TagDefinition): void {
    ProjectSearchDispatcher.dispatch({
      type: 'ADD_TAG',
      tag: tag.tag_name,
    });
    metrics.addTagFilterEvent(tag);
  }
  
  render(): React$Node {
    return (
      <div>
        { this.state.tags && this.state.tagCounts
          ? (
            <SelectorDropdown
              title={this.props.title}
              options={this.state.tags}
              optionCategory={this.state.hasSubcategories && (tag => tag.subcategory)}
              optionDisplay={tag => this._displayTag(tag)}
              optionEnabled={tag => this.state.tagCounts[tag.tag_name]}
              onOptionSelect={this.selectTag.bind(this)}
            />
            )
          : null
        }
      </div>
    );
  }
  
  _displayTag(tag: TagDefinition): string {
    const tagCount: number = this.state.tagCounts[tag.tag_name] || 0;
    let tagDisplay: string = tag.display_name;
    if(tagCount > 0) {
      tagDisplay += " (" + tagCount + ")";
    }
    return tagDisplay;
  }
}

export default Container.create(TagSelectorDropdown);