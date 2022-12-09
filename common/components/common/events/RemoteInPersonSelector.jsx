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
  isRemote: boolean,
|};

const RemoteInPersonOptions: $ReadOnlyArray<KeyValuePair<boolean>> = [
  ["In-Person", false],
  ["Remote", true],
];

/**
 * Dropdown selector for selecting remote/in-person for an event
 */
class RemoteInPersonSelector extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      isRemote: RemoteInPersonSelector.getSelected(props),
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.isRemote = RemoteInPersonSelector.getSelected(props);
    return state;
  }

  static getSelected(props: Props): LocationTimezone {
    return props.useFormFieldsStore
      ? FormFieldsStore.getFormFieldValue(props.elementId)
      : props.isRemote.toString();
  }

  handleSelection(remoteInPersonOption: KeyValuePair<boolean>) {
    // TODO: Send to flux store
    this.props.onSelection(remoteInPersonOption[1]);
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Selector
          id={this.props.elementId || "is_remote"}
          isSearchable={true}
          isClearable={false}
          isMultiSelect={false}
          options={RemoteInPersonOptions}
          labelGenerator={(kvp: KeyValuePair<boolean>) => kvp[0]}
          valueStringGenerator={(kvp: KeyValuePair<boolean>) => kvp[1].toString()}
          selected={this.state.isRemote}
          onSelection={this.handleSelection.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default Container.create(RemoteInPersonSelector, { withProps: true });
