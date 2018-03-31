// @flow

import React from 'react'
import Select from 'react-select'
import type {TagDefinition} from '../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js';
import _ from 'lodash'

type Props = {|
  elementId: string,
  category: string,
  allowMultiSelect: boolean,
  value?: TagDefinition,
  onSelection: ($ReadOnlyArray<TagDefinition>) => void
|};
type State = {|
  displayList: Array<TagDefinition>,
  tagMap: {[key: string]: TagDefinition},
  selected?: TagDefinition,
  initialized: boolean
|};

/**
 * Dropdown selector for tags
 */
class TagSelector extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      tags: []
    };
    
    ProjectAPIUtils.fetchTagsByCategory(this.props.category, (tags) => {
      const tagMap = _.mapKeys(tags, (tag) => tag.tag_name);
      const displayList = tags.map(function(tag){
        return {
          value: tag.tag_name,
          label: tag.subcategory ? `${tag.subcategory}: ${tag.display_name}` : tag.display_name
        }
      });
      this.setState({
        tagMap: tagMap,
        displayList: displayList
      });
    });
  }
  
  getDisplayTag(tag: TagDefinition): TagDefinition {
    return this.state.displayList.find(displayTag => displayTag.value === tag.value);
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(!this.state.initialized && !_.isEmpty(nextProps.value)) {
      const displayTags = nextProps.value.map(tag => this.getDisplayTag(tag));
      this.setState({
        selected: nextProps.allowMultiSelect ? displayTags : displayTags[0],
        initialized: true
      });
    }
  }
  
  handleSelection(selectedValueOrValues: TagDefinition | $ReadOnlyArray<TagDefinition>): void {
    this.setState({selected: selectedValueOrValues});
    const selectedValues = this.props.allowMultiSelect ? selectedValueOrValues : [selectedValueOrValues];
    var tags:TagDefinition = Object.seal(selectedValues.map(value => this.state.tagMap[value.value]));
    this.props.onSelection(tags);
  }
  
  render(): React$Node {
    return (
      <div>
        <Select
          id={this.props.elementId}
          name={this.props.elementId}
          options={this.state.displayList}
          value={this.state.selected}
          onChange={this.handleSelection.bind(this)}
          className="form-control"
          simpleValue={false}
          clearable={false}
          multi={this.props.allowMultiSelect}
          joinValues={true}
        />
      </div>
    );
  }
}

export default TagSelector;