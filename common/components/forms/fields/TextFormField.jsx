// @flow

import React from "react";
import { Container } from "flux/utils";
import Form from "react-bootstrap/Form";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { Dictionary } from "../../types/Generics.jsx";
import formHelper from "../../utils/forms.js";
import _ from "lodash";
import InlineFormError from "../InlineFormError.jsx";

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
  exampleLink: ?string,
|};

type State = {|
  value: string,
  errorFeedback: string,
  elementType: string,
  touched: boolean,
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
    state.touched = FormFieldsStore.isFormFieldTouched(props.id);
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

  onBlur(event: SyntheticInputEvent<HTMLInputElement>): void {
    UniversalDispatcher.dispatch({
      type: "TOUCH_FORM_FIELD",
      fieldName: this.props.id,
    });
  }

  render(): React$Node {
    const label: string = this.props.required
      ? formHelper.appendRequired(this.props.label)
      : this.props.label;
    const exampleLink: ?React$Node = this.props.exampleLink ? (
      <a
        className="label-hint"
        target="_blank"
        rel="noopener noreferrer"
        href={this.props.exampleLink}
      >
        (Example)
      </a>
    ) : null;
    return (
      <React.Fragment>
        <Form.Group controlId={this.props.id}>
          <span className="d-flex justify-content-between">
            <Form.Label>
              {label} {exampleLink}
            </Form.Label>
            {this.props.showCount && (
              <div className="character-count">
                {(this.state.value || "").length} / {this.props.maxLength}
              </div>
            )}
          </span>
          <Form.Control
            required={false}
            as={this.state.elementType}
            name={this.props.id}
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            onBlur={this.onBlur.bind(this)}
            isInvalid={this.state.touched && this.state.errorFeedback}
            rows={this.props.rows || 1}
            maxLength={this.props.maxLength}
            tabIndex="0"
          />
          <InlineFormError id={this.props.id} />
        </Form.Group>
      </React.Fragment>
    );
  }
}

export default Container.create(TextFormField, { withProps: true });
