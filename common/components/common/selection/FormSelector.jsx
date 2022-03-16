// @flow

import React from "react";
import _ from "lodash";
import { Container } from "flux/utils";
import Selector, { SelectorProps } from "./Selector.jsx";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";

type State<T> = {|
  selected: T,
|};

// Wrapper around Selector that uses FormFieldsStore
class FormSelector<T> extends React.Component<SelectorProps<T>, State<T>> {
  constructor(props: Props<T>): void {
    super();
    this.state = {
      selected: FormFieldsStore.getFormFieldValue(props.id),
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.selected = FormFieldsStore.getFormFieldValue(props.id);
    return state;
  }

  handleSelection(selection: T) {
    const value: T | string = selection;
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: this.props.id,
      fieldValue: value,
    });
  }

  render(): React$Node {
    return (
      <Selector
        {...this.props}
        selected={this.state.selected}
        onSelection={this.handleSelection.bind(this)}
      />
    );
  }
}

export default Container.create(FormSelector, {
  withProps: true,
});
