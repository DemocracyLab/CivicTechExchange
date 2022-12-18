// @flow

import React from "react";
import { Container } from "flux/utils";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { Dictionary, KeyValuePair } from "../../types/Generics.jsx";
import Selector from "../selection/Selector.jsx";
import _ from "lodash";

type Props = {|
  elementId: string,
  isRemote: boolean,
  onSelection: (isRemote: boolean) => void,
  useFormFieldsStore: Boolean,
|};
type State = {|
  option: string,
|};

// Mappings between In-Person/Remote options and their mapping to the 'isRemote' value
const RemoteInPersonOptions: Dictionary<boolean> = {
  "In-Person": false,
  "Remote": true,
};
const OptionsByRemoteState: Dictionary<string> = _.invert(RemoteInPersonOptions);

/**
 * Dropdown selector for selecting remote/in-person for an event
 */
class RemoteInPersonSelector extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      option: RemoteInPersonSelector.getSelected(props),
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({option: RemoteInPersonSelector.getSelected(nextProps)});
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.option = RemoteInPersonSelector.getSelected(props);
    return state;
  }

  static getSelected(props: Props): string {
    return props.useFormFieldsStore
      ? FormFieldsStore.getFormFieldValue(props.elementId)
      : OptionsByRemoteState[props.isRemote];
  }

  handleSelection(option: string) {
    this.props.onSelection && this.props.onSelection(RemoteInPersonOptions[option]);
    if (this.props.useFormFieldsStore) {
      UniversalDispatcher.dispatch({
        type: "UPDATE_FORM_FIELD",
        fieldName: this.props.elementId,
        fieldValue: option,
      });
    }
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Selector
          id={this.props.elementId || "is_remote"}
          placeholder="Select RSVP Type"
          isSearchable={true}
          isClearable={false}
          isMultiSelect={false}
          options={_.keys(RemoteInPersonOptions)}
          labelGenerator={(key: string) => key}
          valueStringGenerator={(key: string) => RemoteInPersonOptions[key].toString()}
          selected={this.state.option}
          onSelection={this.handleSelection.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default Container.create(RemoteInPersonSelector, { withProps: true });
