// @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import type { Dictionary } from "../types/Generics.jsx";
import validationHelper, { FormFieldValidator } from "../utils/validation.js";
import _ from "lodash";
import { createDictionary } from "../types/Generics.jsx";

// TODO: Document this!
// TODO: Unit test

type SetFormFieldsActionType = {
  type: "SET_FORM_FIELDS" | "ADD_FORM_FIELDS",
  formFieldValues: Dictionary<any>,
  validators: ?$ReadOnlyArray<FormFieldValidator<any>>,
};

type UpdateFormFieldActionType<T> = {
  type: "UPDATE_FORM_FIELD",
  fieldName: string,
  fieldValue: T,
};

type UpdateFormFieldsActionType<T> = {
  type: "UPDATE_FORM_FIELDS",
  formFieldValues: Dictionary<any>,
};

type TouchFormFieldActionType = {
  type: "TOUCH_FORM_FIELD",
  fieldName: ?string,
};

type AttemptSubmitActionType = {
  type: "ATTEMPT_SUBMIT",
};

export type FormFieldsActionType =
  | SetFormFieldsActionType
  | UpdateFormFieldActionType
  | TouchFormFieldActionType;

class State extends Record({}) {
  validators: $ReadOnlyArray<FormFieldValidator<any>>;
  originalFormFieldValues: Dictionary<any>;
  formFieldValues: Dictionary<any>;
  formFieldErrors: Dictionary<string>;
  formFieldsTouched: Dictionary<boolean>;
  submitAttempted: boolean;
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
      case "ADD_FORM_FIELDS":
        return this.addFormFields(state, action);
      case "UPDATE_FORM_FIELD":
        return this.updateFormField(state, action);
      case "UPDATE_FORM_FIELDS":
        return this.updateFormFields(state, action);
      case "TOUCH_FORM_FIELD":
        return this.touchFormField(state, action);
      case "ATTEMPT_SUBMIT":
        return this.attemptSubmit(state, action);
      default:
        return state;
    }
  }

  setFormFields(state: State, action: SetFormFieldsActionType): State {
    state.submitAttempted = false;
    state.validators = action.validators;
    state.originalFormFieldValues = action.formFieldValues;
    state.formFieldValues = _.clone(action.formFieldValues);
    state.formFieldsTouched = createDictionary(
      _.keys(action.formFieldValues),
      fieldName => fieldName,
      fieldName => false
    );
    state = this.processErrors(state);
    return state;
  }

  addFormFields(state: State, action: SetFormFieldsActionType): State {
    state = _.clone(state);
    state.validators = state.validators.concat(action.validators);
    state.originalFormFieldValues = _.assign(
      state.originalFormFieldValues,
      action.formFieldValues
    );
    state.formFieldValues = _.assign(
      state.formFieldValues,
      action.formFieldValues
    );
    state.formFieldsTouched = _.assign(
      state.formFieldsTouched,
      createDictionary(
        _.keys(action.formFieldValues),
        fieldName => fieldName,
        fieldName => false
      )
    );
    state = this.processErrors(state);
    return state;
  }

  updateFormField(state: State, action: UpdateFormFieldActionType): State {
    state.formFieldValues[action.fieldName] = action.fieldValue;
    state.formFieldsTouched[action.fieldName] = true;
    state = this.processErrors(state);
    return _.clone(state);
  }

  updateFormFields(state: State, action: UpdateFormFieldsActionType): State {
    _.keys(action.formFieldValues).forEach((formFieldId: string) => {
      state.formFieldsTouched[formFieldId] = true;
    });
    state.formFieldValues = _.assign(
      state.formFieldValues,
      action.formFieldValues
    );
    state = this.processErrors(state);
    return _.clone(state);
  }

  attemptSubmit(state: State, action: AttemptSubmitActionType): State {
    state.submitAttempted = true;
    return _.clone(state);
  }

  touchFormField(state: State, action: TouchFormFieldActionType): State {
    if (action.fieldName) {
      state.formFieldsTouched[action.fieldName] = true;
    } else {
      // Touch all fields
      _.keys(state.formFieldsTouched).forEach((key: string) => {
        state.formFieldsTouched[key] = true;
      });
    }
    state = this.processErrors(state);
    return _.clone(state);
  }

  processErrors(state: State): State {
    state.formFieldErrors = !_.isEmpty(state.validators)
      ? validationHelper.getErrors(state.validators, state.formFieldValues)
      : {};
    return state;
  }

  getFormFieldValues(): Dictionary<any> {
    const state: State = this.getState();
    return state.formFieldValues;
  }

  getFormFieldValue(key: string): any {
    const state: State = this.getState();
    return state.formFieldValues && state.formFieldValues[key];
  }

  isFormFieldTouched(key: string): boolean {
    const state: State = this.getState();
    return state.formFieldsTouched && state.formFieldsTouched[key];
  }

  areFormFieldsChanged(): boolean {
    const state: State = this.getState();
    return !_.isEqual(state.originalFormFieldValues, state.formFieldValues);
  }

  wasSubmitAttempted(): boolean {
    return this.getState().submitAttempted;
  }

  getFormFieldError(key: string): ?string {
    return this.getState().formFieldErrors[key];
  }

  fieldsAreValid(): boolean {
    return _.isEmpty(this.getState().formFieldErrors);
  }
}

export default new FormFieldsStore();
