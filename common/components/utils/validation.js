// @flow

import { createDictionary, Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

export type FormFieldValidator<T> = {|
  fieldName: string,
  checkFunc: T => boolean,
  errorMessage: string | (T => string),
|};

class validationHelper {
  // TODO: Unit test
  static getErrors<T>(
    validations: $ReadOnlyArray<FormFieldValidator<T>>,
    formFields: T
  ): Dictionary<string> {
    const failingValidations: $ReadOnlyArray<
      FormFieldValidator<T>
    > = validations.map(
      (validation: FormFieldValidator<T>) => !validation.checkFunc(formFields)
    );

    return createDictionary(
      failingValidations,
      (v: FormFieldValidator<T>) => v.fieldName,
      this.getErrorMessage
    );
  }

  // TODO: Unit test
  static getErrorMessage<T>(
    validation: FormFieldValidator<T>,
    formFields: T
  ): string {
    return _.isFunction(validation.errorMessage)
      ? validation.errorMessage(formFields)
      : validation.errorMessage;
  }
}

export default validationHelper;
