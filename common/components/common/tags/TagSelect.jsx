// @flow

import React from 'react'
import Select from 'react-select'

type TagOption = {|
  value: string,
  label: string
|};

type Props = {|
  elementId: string,
  category: string,
  value?: string,
  onSelection: (string) => void
|};
type State = {|
  tags: Array<TagOption>,
  selected: string
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
      this.setState({selected: nextProps.value || ""});
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