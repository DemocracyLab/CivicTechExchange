// @flow

import React from "react";
import _ from "lodash";

export type Validator<T> = {|
  checkFunc: (formState: T) => boolean,
  errorMessage: string,
|};

type Props<T> = {|
  +validations: $ReadOnlyArray<Validator<T>>,
  +onValidationCheck: boolean => void,
  formState: any,
  errorMessages: $ReadOnlyArray<string>,
|};
type State = {|
  errorMessages: $ReadOnlyArray<string>,
|};

/**
 * Performs validations for forms, displaying errors in the markup where the component is placed
 */
class FormValidation<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props<T>): void {
    super(props);
    this.state = {
      errorMessages: [],
    };
  }

  static (nextProps: Props<T>, state){
    if (nextProps.formState && nextProps.validations) {
      let errorMessages: Array<string> = this.props.errorMessages || [];
      let validationSuccess = _.isEmpty(errorMessages);
      if (nextProps.validations) {
        const failedValidations = FormValidation.getValidationErrors(
          nextProps.formState,
          nextProps.validations
        );
        validationSuccess = validationSuccess && _.isEmpty(failedValidations);
        errorMessages = _.concat(
          errorMessages,
          failedValidations.map(validation => validation.errorMessage)
        );
      }
      return { errorMessages: errorMessages };
      nextProps.onValidationCheck &&
        nextProps.onValidationCheck(validationSuccess);
    } else {
      return{ errorMessages: nextProps.errorMessages };
    }
  }

  render(): React$Node {
    return (
      <ul>
        {(this.state.errorMessages || []).map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    );
  }

  static isValid<T>(
    formFields: T,
    validators: $ReadOnlyArray<Validator<T>>
  ): boolean {
    const failedValidations = validators.filter(
      validator => !validator.checkFunc(formFields)
    );
    return _.isEmpty(failedValidations);
  }

  static getValidationErrors<T>(
    formFields: T,
    validators: $ReadOnlyArray<Validator<T>>
  ) {
    return validators.filter(validator => !validator.checkFunc(formFields));
  }
}

export default FormValidation;
