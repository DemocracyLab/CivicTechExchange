// @flow

import React from 'react'
import Select from 'react-select'
import _ from 'lodash'



type Props = {|
  elementId: string,
  category: string,
  value?: string,
  onSelection: (string) => void
|};
type State = {|
  tags: Array<TagDefinition>,
  selected: TagDefinition
|};

/**
 * Dropdown selector for tags
 */
class TagSelect extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      tags: [],
      selected: this.props.value || ""
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
      this.setState({selected: {value:nextProps.value, label:_.find(this.state.tags, tag => tag.value === nextProps.value).label} || ""});
    }
  }
  
  handleSelection(selectedValueOrValues: string): void {
    this.setState({selected: selectedValueOrValues});
    this.props.onSelection(selectedValueOrValues);
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

export default TagSelect;