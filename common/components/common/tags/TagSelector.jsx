// @flow

import React from 'react'
import Select from 'react-select'
import type {TagDefinition} from '../../../components/utils/ProjectAPIUtils.js';
import _ from 'lodash'

type Props = {|
  elementId: string,
  category: string,
  allowMultiSelect: boolean,
  value?: TagDefinition,
  onSelection: (TagDefinition) => void
|};
type State = {|
  tags: Array<TagDefinition>,
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
    
    fetch(new Request('/api/tags?category=' + this.props.category))
      .then(response => response.json())
      .then(tags =>
        tags.map(tag => ({
          value: tag.tag_name,
          label: tag.subcategory ? `${tag.subcategory}: ${tag.display_name}` : tag.display_name
        }))
      )
      .then(options => this.setState({tags: options}));
  }
  
  getDisplayTag(tag: TagDefinition): TagDefinition {
    return this.state.tags.find(displayTag => displayTag.value === tag.value);
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
    var tags:TagDefinition = Object.seal(selectedValues.map(value => value.value));
    this.props.onSelection(this.props.allowMultiSelect ? tags : [tags]);
  }
  
  render(): React$Node {
    return (
      <div>
        <Select
          id={this.props.elementId}
          name={this.props.elementId}
          options={this.state.tags}
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