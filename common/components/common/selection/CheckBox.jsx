// @flow

import React from "react";
import Form from "react-bootstrap/Form";
import { Container } from "flux/utils";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import _ from "lodash";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import InlineFormError from "../../forms/InlineFormError.jsx";

type Props = {|
  id: string,
  label: ?string,
|};

type State = {|
  value: boolean,
  errorFeedback: ?string,
  touched: boolean,
|};

// Checkbox wrapper that harmonizes with django's form handling
class CheckBox extends React.Component<Props, State> {
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
    return state;
  }

  _onCheck(event: SyntheticInputEvent<HTMLInputElement>): void {
    const checkValue: boolean = event.target.checked;
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: this.props.id,
      fieldValue: checkValue,
    });
  }

  render(): ?React$Node {
    return (
      <React.Fragment>
        <HiddenFormFields
          sourceDict={_.fromPairs([
            [this.props.id, this.state.value ? "on" : "off"],
          ])}
        />
        <Form.Check
          type="checkbox"
          id={this.props.id}
          onChange={this._onCheck.bind(this)}
        >
          <Form.Check.Input
            isInvalid={this.state.touched && this.state.errorFeedback}
            checked={!!this.state.value}
            onChange={this._onCheck.bind(this)}
          />
          {this._renderLabelContent()}
        </Form.Check>
        <InlineFormError id={this.props.id} />
      </React.Fragment>
    );
  }

  _renderLabelContent(): ?React$Node {
    const content: React$Node = this.props.label
      ? this.props.label
      : this.props.children;
    return <Form.Check.Label>{content}</Form.Check.Label>;
  }
}

export default Container.create(CheckBox, { withProps: true });
