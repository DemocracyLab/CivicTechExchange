// @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import type { Dictionary } from "../types/Generics.jsx";
import validationHelper, { FormFieldValidator } from "../utils/validation.js";
import _ from "lodash";
import { createDictionary } from "../types/Generics.jsx";

// TODO: Unit test

// SET_FORM_FIELDS: Set up fields for form
// ADD_FORM_FIELDS: Add fields to already set up form
type SetFormFieldsActionType = {
  type: "SET_FORM_FIELDS" | "ADD_FORM_FIELDS",
  formFieldValues: Dictionary<any>,
  validators: ?$ReadOnlyArray<FormFieldValidator<any>>,
};

// UPDATE_FORM_FIELD: Update single form field
type UpdateFormFieldActionType<T> = {
  type: "UPDATE_FORM_FIELD",
  fieldName: string,
  fieldValue: T,
};

// UPDATE_FORM_FIELDS: Update multiple form fields
type UpdateFormFieldsActionType<T> = {
  type: "UPDATE_FORM_FIELDS",
  formFieldValues: Dictionary<any>,
};

// TOUCH_FORM_FIELD: Touch form field without changing the value
type TouchFormFieldActionType = {
  type: "TOUCH_FORM_FIELD",
  fieldName: ?string,
};

// ATTEMPT_SUBMIT: Flag attempt to submit the form
type AttemptSubmitActionType = {
  type: "ATTEMPT_SUBMIT",
};

export type FormFieldsActionType =
  | SetFormFieldsActionType
  | UpdateFormFieldActionType
  | UpdateFormFieldsActionType
  | TouchFormFieldActionType
  | AttemptSubmitActionType;

class State extends Record({}) {
  validators: $ReadOnlyArray<FormFieldValidator<any>>;
  originalFormFieldValues: Dictionary<any>;
  formFieldValues: Dictionary<any>;
  formFieldErrors: Dictionary<string>;
  formFieldsTouched: Dictionary<boolean>;
  submitAttempted: boolean;
}

// Store for managing form field values, and providing helper methods for form workflows
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

  /**
   * @returns All form fields and their values
   */
  getFormFieldValues(): Dictionary<any> {
    const state: State = this.getState();
    return state.formFieldValues;
  }

  /**
   * @param key   Form field id
   * @returns {*} Form field current value
   */
  getFormFieldValue(key: string): any {
    const state: State = this.getState();
    return state.formFieldValues && state.formFieldValues[key];
  }

  /**
   * @param key Form field id
   * @returns {boolean} Whether form field has been touched
   */
  isFormFieldTouched(key: string): boolean {
    const state: State = this.getState();
    return state.formFieldsTouched && state.formFieldsTouched[key];
  }

  /**
   * @returns {boolean} Whether any form fields have been changed from their initial values
   */
  areFormFieldsChanged(): boolean {
    const state: State = this.getState();
    return !_.isEqual(state.originalFormFieldValues, state.formFieldValues);
  }

  /**
   * @returns {boolean} Whether a submit operation was attempted (but didn't necessarily succeed)
   */
  wasSubmitAttempted(): boolean {
    return this.getState().submitAttempted;
  }

  /**
   * @param key Form field id
   * @returns {string}  Any error in the form field's current value
   */
  getFormFieldError(key: string): ?string {
    return this.getState().formFieldErrors[key];
  }

  /**
   * @returns {boolean} Whether all current form field values are valid
   */
  fieldsAreValid(): boolean {
    return _.isEmpty(this.getState().formFieldErrors);
  }
}

export default new FormFieldsStore();
