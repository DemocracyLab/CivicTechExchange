// @flow

import React from 'react'
import Select from 'react-select'
import type {TagDefinition} from '../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js';
import _ from 'lodash'

type TagOption = {|
  value: string,
  label: string,
|};

type Props = {|
  elementId: string,
  category: string,
  allowMultiSelect: boolean,
  value?: $ReadOnlyArray<TagDefinition>,
  onSelection: ($ReadOnlyArray<TagDefinition>) => void
|};
type State = {|
  displayList: Array<TagOption>,
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
    this.state = {};
    
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
        displayList: _.sortBy(displayList, ['label'])
      });
      this.initializeSelectedTags(props);
    });
  }
  
  initializeSelectedTags(props: Props):void {
    if(props.value) {
      const displayTags: $ReadOnlyArray<TagOption> = props.value[0]
        ? props.value.map(tag => this.getDisplayTag(tag))
        : [null];
      this.setState({selected : props.allowMultiSelect ? displayTags : displayTags[0]});
    }
  }
  
  getDisplayTag(tag: TagDefinition): TagOption {
    return this.state.displayList.find(displayTag => displayTag.value === tag.tag_name);
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(!this.state.initialized && !_.isEmpty(nextProps.value)) {
      this.initializeSelectedTags(nextProps);
    }
  }
  
  handleSelection(selectedValueOrValues: TagDefinition | $ReadOnlyArray<TagDefinition>): void {
    this.setState({selected: selectedValueOrValues});
    if(selectedValueOrValues) {
      const selectedValues = this.props.allowMultiSelect ? selectedValueOrValues : [selectedValueOrValues];
      var tags: TagDefinition = Object.seal(selectedValues.map(value => this.state.tagMap[value.value]));
      this.props.onSelection(tags);
    } else {
      this.props.onSelection(null);
    }
  }
  
  render(): React$Node {
    return (
      <div>
        <Select
          id={this.props.elementId}
          name={this.props.elementId}
          options={this.state && this.state.displayList}
          value={this.state && this.state.selected}
          onChange={this.handleSelection.bind(this)}
          className="form-control"
          simpleValue={false}
          isClearable={!this.props.allowMultiSelect}
          isMulti={this.props.allowMultiSelect}
          delimiter=","
          backspaceRemovesValue={true}
        />
      </div>
    );
  }
}

export default TagSelector;