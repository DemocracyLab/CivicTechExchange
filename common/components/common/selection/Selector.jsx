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
  onSelection: (T) => void
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
    
    const labelGenerator: (T) => string = props.labelGenerator || _.toString;
    const valueStringGenerator: (T) => string = props.valueStringGenerator || labelGenerator;
    const optionIndex: Dictionary<T> = createDictionary(props.options, labelGenerator);
    const selectOptions: $ReadOnlyArray<SelectOption> = props.options.map(key => ({"value": valueStringGenerator(key), "label": labelGenerator(key)}));
    const selected: SelectOption = this.findOption(selectOptions, labelGenerator(props.selected));
    this.state = {
      labelGenerator: labelGenerator,
      selected: selected,
      selectOptions: selectOptions,
      optionIndex: optionIndex
    };
  }
  
  findOption<T>(selectOptions: $ReadOnlyArray<SelectOption>, option: string) {
    return selectOptions.find((selectOption: SelectOption) => selectOption.label === option);
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({selected: this.findOption(this.state.selectOptions, this.state.labelGenerator(nextProps.selected))}, function() {
      this.forceUpdate();
    });
  }

  handleSelection(selection: SelectOption) {
    this.props.onSelection(this.state.optionIndex[selection.label]);
  }
  
  render(): React$Node {
    return (
      <Select
        id={this.props.id}
        name={this.props.id}
        options={this.state.selectOptions}
        value={this.state.selected}
        onChange={this.handleSelection.bind(this)}
        isSearchable={this.props.isSearchable || defaultFlags.isSearchable}
        isClearable={this.props.isMultiSelect || defaultFlags.isMultiSelect}
        isMulti={this.props.isMultiSelect || defaultFlags.isMultiSelect}
      />
    );
  }
}

export default Selector;