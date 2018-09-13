// @flow

import React from 'react'
import Select from 'react-select'
import type {TagDefinition} from '../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js';
import Promise from 'bluebird'
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
  loadTagsPromise: Promise<Array<TagOption>>
|};

/**
 * Dropdown selector for tags
 */
class TagSelector extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
  
    // TODO: Convert callback into .then clause
    const loadTagsPromise = ProjectAPIUtils.fetchTagsByCategory(this.props.category, false, (tagMap: Array<TagDefinition>) => {
      let displayList: Array<TagOption> = _.values(tagMap).map(function(tag){
        return {
          value: tag.tag_name,
          label: tag.subcategory ? tag.subcategory + ": " + tag.display_name : tag.display_name
        }
      });
      displayList = _.sortBy(displayList, ['label']);
      this.setState({
        tagMap: _.mapKeys(tagMap, (tag: TagDefinition) => tag.tag_name),
        displayList: displayList
      });
      
      return displayList;
    });
  
    this.state = {
      loadTagsPromise: loadTagsPromise
    };
  }
  
  initializeSelectedTags(props: Props, displayList: Array<TagOption>):void {
    if(props.value) {
      const displayTags: $ReadOnlyArray<TagOption> = props.value[0]
        ? props.value.map(tag => this.getDisplayTag(tag, displayList))
        : [null];
      this.setState({selected : props.allowMultiSelect ? displayTags : displayTags[0]});
    }
  }
  
  getDisplayTag(tag: TagDefinition, displayList: Array<TagOption>): TagOption {
    return displayList.find(displayTag => displayTag.value === tag.tag_name);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if(!_.isEmpty(nextProps.value)) {
      this.state.loadTagsPromise.then(tagOptions => {
        this.initializeSelectedTags(nextProps, tagOptions);
      });
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
