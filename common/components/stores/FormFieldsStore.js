// @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import type { Dictionary } from "../types/Generics.jsx";
import validationHelper, { FormFieldValidator } from "../utils/validation.js";
import _ from "lodash";

type SetFormFieldsActionType = {
  type: "SET_FORM_FIELDS",
  formFieldValues: Dictionary<any>,
  validators: ?$ReadOnlyArray<FormFieldValidator<any>>,
};

type UpdateFormFieldActionType<T> = {
  type: "UPDATE_FORM_FIELD",
  fieldName: string,
  fieldValue: T,
};

export type FormFieldsActionType =
  | SetFormFieldsActionType
  | UpdateFormFieldActionType;

class State extends Record({}) {
  validators: $ReadOnlyArray<FormFieldValidator<any>>;
  formFieldValues: Dictionary<any>;
  formFieldErrors: Dictionary<string>;
}

// Store for broadcasting the header height to any components that need to factor it in
class FormFieldsStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    const state = new State();
    return state;
  }

  reduce(state: State, action: FormFieldsActionType): State {
    switch (action.type) {
      case "SET_FORM_FIELDS":
        return this.setFormFields(state, action);
      case "UPDATE_FORM_FIELD":
        return this.updateFormField(state, action);
      default:
        return state;
    }
  }

  setFormFields(state: State, action: SetFormFieldsActionType): State {
    state.validators = action.validators;
    state.formFieldValues = action.formFieldValues;
    state = this.processErrors(state);
    return state;
  }

  updateFormField(state: State, action: UpdateFormFieldActionType): State {
    state.formFieldValues[action.fieldName] = action.fieldValue;
    state = this.processErrors(state);
    return _.clone(state);
  }

  processErrors(state: State): State {
    state.formFieldErrors = !_.isEmpty(state.validators)
      ? validationHelper.getErrors(state.validators, state.formFieldValues)
      : {};
    return state;
  }

  getFormFieldValue(key: string): any {
    const state: State = this.getState();
    return state.formFieldValues && state.formFieldValues[key];
  }

  getFormFieldError(key: string): ?string {
    return this.getState().formFieldErrors[key];
  }

  fieldsAreValid(): boolean {
    return _.isEmpty(this.getState().formFieldErrors);
  }
}

export default new FormFieldsStore();
