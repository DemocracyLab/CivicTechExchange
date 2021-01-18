// @flow

import React from 'react'
import type {TagDefinition} from '../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js';
import TagSelectWrapper from "./TagSelectWrapper.jsx";

type Props = {|
  elementId: string,
  category: string,
  allowMultiSelect: boolean,
  value?: $ReadOnlyArray<TagDefinition>,
  onSelection: ($ReadOnlyArray<TagDefinition>) => void
|};
type State = {|
  tags: $ReadOnlyArray<TagDefinition>
|};

export function tagOptionDisplay(tag: TagDefinition) {
  return tag.subcategory ? tag.subcategory + ": " + tag.display_name : tag.display_name;
}

/**
 * Dropdown selector for tags
 */
class TagSelector extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
  
    ProjectAPIUtils.fetchTagsByCategory(props.category, false, this.handleFetchTags.bind(this));
    
    this.state = {
      tags: null
    };
  }
  
  handleFetchTags(tags: Array<TagDefinition>): void {                                                                                 
    this.setState({
      tags: tags
    });
  }
  
  // TODO: Replace with Selector component
  render(): React$Node {
    return (
      <React.Fragment>
        <TagSelectWrapper
          elementId={this.props.elementId}
          allowMultiSelect={this.props.allowMultiSelect}
          value={this.props.value}
          tagOptions={this.state.tags}
          onSelection={this.props.onSelection}
        />
      </React.Fragment>
    );
  }
}



export default TagSelector;
