// @flow

import React from "react";
import DatePicker from "react-datepicker";
import { Container } from "flux/utils";
import _ from "lodash";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import type { Dictionary } from "../../types/Generics.jsx";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { createDictionary } from "../../types/Generics.jsx";
import InlineFormError from "../../forms/InlineFormError.jsx";

type Props = {|
  dateTimeStart: ?string,
  dateTimeEnd: ?string,
  formLabels: ?$ReadOnlyArray<string>,
  formIds: ?$ReadOnlyArray<string>,
|};

type State = {|
  formLabels: $ReadOnlyArray<string>,
  formFields: Dictionary<any>,
  formFieldErrors: Dictionary<string>,
|};
export class DateRangeSelectors extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();

    this.config = {
      timeIntervals: 15,
      timeFormat: "HH:mm",
      dateFormat: "MMMM d, yyyy h:mm aa",
    };

    this.state = {
      dateTimeStart: props.dateTimeStart || new Date(),
      dateTimeEnd: props.dateTimeEnd,
      formLabels: props.formLabels || ["Start", "End"],
    };

    this.onChangeDateTime = this.onChangeDateTime.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.formFields = _.clone(FormFieldsStore.getFormFieldValues());
    state.formFieldErrors = createDictionary(
      props.formIds,
      (id: string) => id,
      (id: string) => FormFieldsStore.getFormFieldError(id)
    );
    return state;
  }

  onChangeDateTime(start: string, end: string): void {
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELDS",
      formFieldValues: _.fromPairs([
        [this.props.formIds[0], start],
        [this.props.formIds[1], end],
      ]),
    });
  }

  render(): React$Node {
    const dateTimeStart: string = this.state?.formFields[this.props.formIds[0]];
    const dateTimeEnd: string = this.state?.formFields[this.props.formIds[1]];

    return (
      <React.Fragment>
        <HiddenFormFields
          sourceDict={_.fromPairs(
            this.props.formIds.map((formId: string) => [
              formId,
              this.state.formFields[formId],
            ])
          )}
        />
        <div className="form-group">
          <label>{this.state.formLabels[0]}</label>
          <div>
            <DatePicker
              key={this.props.formIds[0]}
              selected={dateTimeStart}
              onChange={date => this.onChangeDateTime(date, dateTimeEnd)}
              maxDate={dateTimeEnd}
              showTimeSelect
              timeFormat={this.config.timeFormat}
              timeIntervals={this.config.timeIntervals}
              dateFormat={this.config.dateFormat}
              placeholderText="Select start time"
            />
          </div>
          <InlineFormError id={this.props.formIds[0]} />
        </div>
        <div className="form-group">
          <label>{this.state.formLabels[1]}</label>
          <div>
            <DatePicker
              key={this.props.formIds[1]}
              selected={dateTimeEnd}
              onChange={date => this.onChangeDateTime(dateTimeStart, date)}
              minDate={dateTimeStart}
              showTimeSelect
              timeFormat={this.config.timeFormat}
              timeIntervals={this.config.timeIntervals}
              dateFormat={this.config.dateFormat}
              placeholderText="Select end time"
            />
          </div>
          <InlineFormError id={this.props.formIds[1]} />
        </div>
      </React.Fragment>
    );
  }
}

export default Container.create(DateRangeSelectors, { withProps: true });
