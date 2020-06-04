// @flow

import React from 'react';
import Select from 'react-select'
import {Dictionary, createDictionary} from "../../types/Generics.jsx";
import type {SelectOption} from "../../types/SelectOption.jsx";
import _ from "lodash";

type SelectorFlags = {|
  isSearchable: boolean,
  isClearable: boolean,
  isMultiSelect: boolean
|};

const defaultFlags: SelectorFlags = {
  isSearchable: false,
  isClearable: true,
  isMultiSelect: false
};

type Props<T> = {|
  id: string,
  options: $ReadOnlyArray<T>,
  selected: T,
  labelGenerator: (T) => string,
  valueStringGenerator: (T) => string,
  onSelection: (T) => void,
  onInputChange: ?(string) => void
|} & SelectorFlags;

type State<T> = {|
  labelGenerator: (T) => string,
  selected: SelectOption,
  selectOptions: $ReadOnlyArray<SelectOption>,
  optionIndex: Dictionary<T>
|};

class Selector<T> extends React.PureComponent<Props<T>, State<T>> {
  constructor(props: Props<T>): void {
    super();
    
    this.state = this.updateOptions(props, {});
  }
  
  findOption<T>(selectOptions: $ReadOnlyArray<SelectOption>, option: string) {
    return selectOptions.find((selectOption: SelectOption) => selectOption.label === option);
  }
  
  updateOptions(props: Props, state: State): State {
    state.labelGenerator = props.labelGenerator || _.toString;
    if(props.options) {
      state.optionIndex = createDictionary(props.options, state.labelGenerator);
      state.selectOptions = props.options.map(key => ({
        "value": (props.valueStringGenerator || state.labelGenerator)(key),
        "label": state.labelGenerator(key)
      }));
      state.selected = props.selected && this.findOption(state.selectOptions, state.labelGenerator(props.selected));
    }
    return state;
  }
  

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.updateOptions(nextProps, this.state), function() {
      this.forceUpdate();
    });
  }

  handleSelection(selection: SelectOption) {
    this.props.onSelection(selection ? this.state.optionIndex[selection.label] : null);
  }
  
  onInputChange(inputValue: string): void {
    this.props.onInputChange && this.props.onInputChange(inputValue);
  }
  
  render(): React$Node {
    return (
      <Select
        id={this.props.id}
        name={this.props.id}
        options={this.state.selectOptions}
        value={this.state.selected}
        onChange={this.handleSelection.bind(this)}
        onInputChange={this.onInputChange.bind(this)}
        isSearchable={this.props.isSearchable || defaultFlags.isSearchable}
        isClearable={this.props.isClearable || defaultFlags.isClearable}
        isMulti={this.props.isMultiSelect || defaultFlags.isMultiSelect}
      />
    );
  }
}

export default Selector;