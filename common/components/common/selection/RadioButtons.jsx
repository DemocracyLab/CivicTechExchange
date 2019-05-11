// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import {SelectOption} from "../../types/SelectOption.jsx";

type Props = {|
  options: $ReadOnlyArray<SelectOption>,
  defaultSelection: ?SelectOption,
  onSelection: (SelectOption) => void
|};

type State = {|
  selectedOption: SelectOption
|};

class RadioButtons extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      selectedOption: props.defaultSelection
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.defaultSelection) {
      this.setState({selectedOption: nextProps.defaultSelection}, function () {
        this.forceUpdate();
      });
    }
  }
  
  handleOptionChange(selection: SelectOption) {
    this.setState({selectedOption: selection}, function() {
      this.forceUpdate();
    });
    this.props.onSelection(selection);
  }
  
  render(): ?React$Node {
    return this.props.options && (
      <React.Fragment>
        {this.props.options.map((option, i) => {
          return (
          <div key={i} className={(this.state.selectedOption && this.state.selectedOption.value === option.value) ? "checked" : "unchecked"} >
            <Button onClick={this.handleOptionChange.bind(this, option)} >
              {option.label}
            </Button>
          </div>
        );
        })};
      </React.Fragment>
    );
  }
}

export default RadioButtons;