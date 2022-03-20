// @flow

import React from "react";
import Select from "react-select";
import { Dictionary, createDictionary } from "../../types/Generics.jsx";
import type { SelectOption } from "../../types/SelectOption.jsx";
import _ from "lodash";

type SelectAction = {|
  name: string,
  action:
    | "clear"
    | "select-option"
    | "deselect-option"
    | "remove-value"
    | "pop-value"
    | "set-value"
    | "create-option",
|};

type SelectorFlags = {|
  isSearchable: boolean,
  isClearable: boolean,
  isMultiSelect: boolean,
  isDisabled: ?boolean,
|};

const defaultFlags: SelectorFlags = {
  isSearchable: false,
  isClearable: true,
  isMultiSelect: false,
};

export type SelectorProps<T> = {|
  id: string,
  options: $ReadOnlyArray<T>,
  selected: T,
  placeholder: string | React$Node,
  noOptionsMessage: string | (() => string | React$Node),
  labelGenerator: T => string,
  valueStringGenerator: T => string,
  onSelection: T => void,
  onInputChange: ?(string) => void,
|} & SelectorFlags;

type State<T> = {|
  labelGenerator: T => string,
  selected: SelectOption,
  selectOptions: $ReadOnlyArray<SelectOption>,
  noOptionsMessage: () => string | React$Node,
  optionIndex: Dictionary<T>,
  isCleared: boolean,
|};

// Generic dropdown selector
class Selector<T> extends React.Component<SelectorProps<T>, State<T>> {
  constructor(props: SelectorProps<T>): void {
    super();

    this.state = Selector.updateOptions(props, {});
  }

  static findOption<T>(
    selectOptions: $ReadOnlyArray<SelectOption>,
    option: string
  ) {
    return selectOptions.find(
      (selectOption: SelectOption) => selectOption.label === option
    );
  }

  static updateOptions(props: SelectorProps, state: State): State {
    state.labelGenerator = props.labelGenerator || _.toString;
    if (props.noOptionsMessage) {
      state.noOptionsMessage = _.isString(props.noOptionsMessage)
        ? () => props.noOptionsMessage
        : props.noOptionsMessage;
    }
    if (props.options) {
      state.optionIndex = createDictionary(props.options, state.labelGenerator);
      state.selectOptions = props.options.map(key => ({
        value: (props.valueStringGenerator || state.labelGenerator)(key),
        label: state.labelGenerator(key),
      }));
    }
    if (props.selected) {
      if (props.options) {
        state.selected =
          props.selected &&
          Selector.findOption(
            state.selectOptions,
            state.labelGenerator(props.selected)
          );
      } else if (!state.isCleared) {
        state.selectOptions = [
          {
            value: (props.valueStringGenerator || state.labelGenerator)(
              props.selected
            ),
            label: state.labelGenerator(props.selected),
          },
        ];
        state.selected = state.selectOptions[0];
      }
    } else {
      state.selected = null;
    }
    return state;
  }

  componentWillReceiveProps(nextProps: SelectorProps): void {
    this.setState(Selector.updateOptions(nextProps, this.state), function() {
      this.forceUpdate();
    });
  }

  handleSelection(selection: SelectOption, selectionAction: SelectAction) {
    if (selectionAction.action === "clear") {
      this.setState((previousState: State) => {
        return {
          ...previousState,
          isCleared: true,
          selected: null,
          selectOptions: [],
        };
      });
      this.forceUpdate();
    }
    this.props.onSelection(
      selection ? this.state.optionIndex[selection.label] : null
    );
  }

  static getDerivedStateFromProps(props, state) {
    // Fix for Bug where user has to click twice in order to remove placeholder selector item
    return Selector.updateOptions(props, state);
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
        placeholder={this.props.placeholder}
        noOptionsMessage={this.state.noOptionsMessage}
        isSearchable={_.defaultTo(
          this.props.isSearchable,
          defaultFlags.isSearchable
        )}
        isClearable={_.defaultTo(
          this.props.isClearable,
          defaultFlags.isClearable
        )}
        isMulti={_.defaultTo(
          this.props.isMultiSelect,
          defaultFlags.isMultiSelect
        )}
        isDisabled={this.props.isDisabled}
      />
    );
  }
}

export default Selector;
