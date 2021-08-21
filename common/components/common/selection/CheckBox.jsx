// @flow

import React from "react";
import Form from "react-bootstrap/Form";
import { Container } from "flux/utils";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import _ from "lodash";

type Props = {|
  id: string,
  label: ?string,
  value: boolean,
  onCheck: boolean => void,
|};

type State = {|
  value: boolean,
  errorFeedback: ?string,
  touched: boolean,
|};

// Checkbox wrapper that harmonizes with django's form handling
class CheckBox extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
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
    if (!this.state.touched) {
      UniversalDispatcher.dispatch({
        type: "TOUCH_FORM_FIELD",
        fieldName: this.props.id,
      });
    } // TODO: Get rid of?
    this.props.onCheck && this.props.onCheck(checkValue);
  }

  render(): ?React$Node {
    return (
      <React.Fragment>
        <input
          type="hidden"
          id={this.props.id}
          name={this.props.id}
          value={this.props.value ? "on" : "off"}
        />
        <Form.Check
          type="checkbox"
          id={this.props.id}
          onChange={this._onCheck.bind(this)}
          checked={this.props.value}
          value={this.props.value}
        >
          <Form.Check.Input
            type="checkbox"
            isInvalid={this.state.touched && this.state.errorFeedback}
            onChange={this._onCheck.bind(this)}
          />
          {this._renderLabelContent()}
          <Form.Control.Feedback type="invalid">
            {this.state.errorFeedback}
          </Form.Control.Feedback>
        </Form.Check>
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
