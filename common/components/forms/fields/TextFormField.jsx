// @flow

import React from "react";
import { Container } from "flux/utils";
import Form from "react-bootstrap/Form";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import _ from "lodash";

type Props = {|
  id: string,
  label: string,
  required: boolean,
  type: string,
  placeholder: ?string,
|};

type State = {|
  value: string,
  errorFeedback: string,
|};
/**
 * Wrapper for text form field
 */
class TextFormField extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.value = FormFieldsStore.getFormFieldValue(props.id);
    state.errorFeedback = FormFieldsStore.getFormFieldError(props.id);
    return state;
  }

  onChange(event: SyntheticInputEvent<HTMLInputElement>): void {
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: this.props.id,
      fieldValue: event.target.value,
    });
  }

  render(): React$Node {
    // TODO: is name field required?
    return (
      <Form.Group controlId={this.props.id}>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          required={this.props.required}
          type={this.props.type}
          name={this.props.id}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          isInvalid={this.state.errorFeedback}
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
          {this.state.errorFeedback}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
}

export default Container.create(TextFormField, { withProps: true });
