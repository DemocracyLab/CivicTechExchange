// @flow

import React from "react";
import { Container } from "flux/utils";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import TagSelectWrapper from "./TagSelectWrapper.jsx";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import _ from "lodash";

type Props = {|
  elementId: string,
  category: string,
  allowMultiSelect: boolean,
  value?: $ReadOnlyArray<TagDefinition>,
  onSelection: ($ReadOnlyArray<TagDefinition>) => void,
  useFormFieldsStore: ?boolean,
|};
type State = {|
  tags: $ReadOnlyArray<TagDefinition>,
  value: ?$ReadOnlyArray<TagDefinition>,
|};

export function tagOptionDisplay(tag: TagDefinition) {
  return tag.subcategory
    ? tag.subcategory + ": " + tag.display_name
    : tag.display_name;
}

/**
 * Dropdown selector for tags
 */
class TagSelector extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    ProjectAPIUtils.fetchTagsByCategory(
      props.category,
      false,
      this.handleFetchTags.bind(this)
    );

    this.state = {
      tags: null,
      value: TagSelector.getSelected(props),
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.value = TagSelector.getSelected(props);
    return state;
  }

  static getSelected(props: Props): $ReadOnlyArray<TagDefinition> {
    return props.useFormFieldsStore
      ? FormFieldsStore.getFormFieldValue(props.elementId)
      : props.value;
  }

  handleFetchTags(tags: Array<TagDefinition>): void {
    this.setState({
      tags: tags,
    });
  }

  pushUpdates(tags: $ReadOnlyArray<TagDefinition>): void {
    this.props.onSelection && this.props.onSelection(tags);
    if (this.props.useFormFieldsStore) {
      UniversalDispatcher.dispatch({
        type: "UPDATE_FORM_FIELD",
        fieldName: this.props.elementId,
        fieldValue: tags,
      });
    }
  }

  // TODO: Replace with Selector component
  render(): React$Node {
    return (
      <React.Fragment>
        <TagSelectWrapper
          elementId={this.props.elementId}
          allowMultiSelect={this.props.allowMultiSelect}
          value={this.state.value}
          tagOptions={this.state.tags}
          onSelection={this.pushUpdates.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default Container.create(TagSelector, { withProps: true });
