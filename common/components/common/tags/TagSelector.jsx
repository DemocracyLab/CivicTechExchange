// @flow

import React from 'react'
import Select from 'react-select'
import type {TagDefinition} from '../../../components/utils/ProjectAPIUtils.js';

type Props = {|
  elementId: string,
  category: string,
  value?: TagDefinition,
  onSelection: (TagDefinition) => void
|};
type State = {|
  tags: Array<TagDefinition>,
  selected?: TagDefinition
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
          label: tag.display_name
        }))
      )
      .then(options => this.setState({tags: options}));
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.value) {
      this.setState({
        selected: nextProps.value
      });
    }
  }
  
  handleSelection(selectedValue: string): void {
    var tag:TagDefinition = Object.seal(this.state.tags.find((tag:TagDefinition) => tag.value === selectedValue));
    this.setState({selected: tag});
    this.props.onSelection(tag);
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
          simpleValue={true}
          clearable={false}
        />
      </div>
    );
  }
}

export default TagSelector;