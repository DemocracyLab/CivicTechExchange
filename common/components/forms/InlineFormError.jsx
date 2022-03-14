// @flow

import React from "react";
import { Container } from "flux/utils";
import _ from "lodash";
import FormFieldsStore from "../stores/FormFieldsStore.js";

type Props = {|
  id: string,
|};

type State = {|
  errorFeedback: string,
  submitAttempted: boolean,
|};
/**
 * Shows inline form error for form element
 */
class InlineFormError extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.errorFeedback = FormFieldsStore.getFormFieldError(props.id);
    state.submitAttempted = FormFieldsStore.wasSubmitAttempted();
    return state;
  }

  render(): React$Node {
    return (
      !_.isEmpty(this.state.errorFeedback) &&
      this.state.submitAttempted && (
        <React.Fragment>
          <div className="invalid-feedback show-error">
            {this.state.errorFeedback}
          </div>
        </React.Fragment>
      )
    );
  }
}

export default Container.create(InlineFormError, { withProps: true });
