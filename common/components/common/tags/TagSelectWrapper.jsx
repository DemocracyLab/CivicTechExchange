// @flow

import React from "react";
import Select from "react-select";
import type { Dictionary } from "../../types/Generics.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import {
  SelectOption,
  mapSelectValueLabel,
} from "../../types/SelectOption.jsx";
import { tagOptionDisplay } from "./TagSelector.jsx";
import _ from "lodash";

type Props = {|
  elementId: string,
  allowMultiSelect: boolean,
  value?: $ReadOnlyArray<TagDefinition>,
  tagOptions: ?$ReadOnlyArray<TagDefinition>,
  onSelection: ($ReadOnlyArray<TagDefinition>) => void,
|};
type State = {|
  displayList: Array<SelectOption>,
  tagMap: Dictionary<TagDefinition>,
  selected?: TagDefinition | Array<SelectOption>,
|};

/**
 * react-select wrapper for selecting Tags
 */
class TagSelectWrapper extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      displayList: null,
      tagMap: null,
      selected: props.value,
    };
  }

  populateOptionsList(props: Props): void {
    let displayList: Array<SelectOption> = mapSelectValueLabel(
      props.tagOptions,
      tag => tag.tag_name,
      tag => tagOptionDisplay(tag)
    );
    displayList = _.sortBy(displayList, ["label"]);
    this.setState({
      tagMap: _.mapKeys(props.tagOptions, (tag: TagDefinition) => tag.tag_name),
      displayList: displayList,
      isLoading: false,
      selected: this.initializeSelectedTags(props, displayList),
    });

    this.forceUpdate();
  }

  initializeSelectedTags(
    props: Props,
    displayList: $ReadOnlyArray<SelectOption>
  ): ?(TagDefinition | Array<SelectOption>) {
    if (props.value) {
      const displayTags: $ReadOnlyArray<SelectOption> = props.value[0]
        ? props.value.map(tag =>
            this.getDisplayTag(tag, displayList || this.state.displayList)
          )
        : [null];
      return props.allowMultiSelect ? displayTags : displayTags[0];
    }
  }

  getDisplayTag(
    tag: TagDefinition,
    displayList: Array<SelectOption>
  ): SelectOption {
    return displayList.find(displayTag => displayTag.value === tag.tag_name);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!_.isEmpty(nextProps.tagOptions)) {
      this.populateOptionsList(nextProps);
    }
  }

  handleSelection(
    selectedValueOrValues: TagDefinition | $ReadOnlyArray<TagDefinition>
  ): void {
    this.setState({ selected: selectedValueOrValues });
    if (selectedValueOrValues) {
      const selectedValues = this.props.allowMultiSelect
        ? selectedValueOrValues
        : [selectedValueOrValues];
      let tags: TagDefinition = Object.seal(
        selectedValues.map(value => this.state.tagMap[value.value])
      );
      this.props.onSelection(tags);
    } else {
      this.props.onSelection(null);
    }
  }

  render(): React$Node {
    return (
      <React.Fragment>
        {this.state && this.state.displayList && (
          <Select
            id={this.props.elementId}
            name={this.props.elementId}
            options={this.state && this.state.displayList}
            value={this.state && this.state.selected}
            onChange={this.handleSelection.bind(this)}
            simpleValue={false}
            isClearable={!this.props.allowMultiSelect}
            isMulti={this.props.allowMultiSelect}
            delimiter=","
            backspaceRemovesValue={true}
          />
        )}
      </React.Fragment>
    );
  }
}

export default TagSelectWrapper;
