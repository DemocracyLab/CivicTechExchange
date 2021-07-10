// @flow

import React from "react";
import { Container } from "flux/utils";
import Form from "react-bootstrap/Form";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { Dictionary } from "../../types/Generics.jsx";
import _ from "lodash";

export const TextFormFieldType: Dictionary<string> = {
  SingleLine: "SingleLine",
  MultiLine: "MultiLine",
};

type Props = {|
  id: string,
  label: string,
  required: boolean,
  type: ?string,
  placeholder: ?string,
  rows: ?number,
  maxLength: ?number,
  showCount: ?boolean,
|};

type State = {|
  value: string,
  errorFeedback: string,
  elementType: string,
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
    state.elementType =
      props.type === TextFormFieldType.MultiLine ? "textarea" : "input";
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
      <React.Fragment>
        <Form.Group controlId={this.props.id}>
          <span className="side-by-side">
            <Form.Label>{this.props.label}</Form.Label>
            {this.props.showCount && (
              <div className="character-count">
                {(this.state.value || "").length} / {this.props.maxLength}
              </div>
            )}
          </span>
          <Form.Control
            required={this.props.required}
            as={this.state.elementType}
            name={this.props.id}
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            isInvalid={this.state.errorFeedback}
            rows={this.props.rows || 1}
            maxLength={this.props.maxLength}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            {this.state.errorFeedback}
          </Form.Control.Feedback>
        </Form.Group>
      </React.Fragment>
    );
  }
}

export default Container.create(TextFormField, { withProps: true });
