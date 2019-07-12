// @flow

// TODO: Document this file
type GetValuesFunc = (React.Component) => T;
type UpdateValuesFunc = (React.Component, T) => void;

export type FormPropsBase<T> = {
  onFormUpdate: (T) => void
};

export type FormStateBase<T> = {
  formFields: T
};

class formHelper {
  static setup<T>(getFormValues: ?GetValuesFunc, onFormUpdate: ?UpdateValuesFunc) {
    const _getFormValues: GetValuesFunc = getFormValues || function(that){
      return that.state.formFields;
    };
    
    const _onFormUpdate: UpdateValuesFunc = onFormUpdate || function(that, formFields) {
      that.setState({formFields});
      that.props.onFormUpdate(formFields);
    };
    
    const onInput = function(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>) {
      const formValues: T = _getFormValues(this);
      formValues[formFieldName] = event.target.value;
      console.log("Updating " + formFieldName + ": " + JSON.stringify(formValues));
      this.forceUpdate();
      _onFormUpdate(this, formValues);
    };
  
    const onSelection = function<V>(formFieldName: string, value: V): void {
      const formValues: T = _getFormValues(this);
      formValues[formFieldName] = value;
      console.log("Updating " + formFieldName + ": " + JSON.stringify(formValues));
      this.forceUpdate();
      _onFormUpdate(this, formValues);
    };
    
    return {
      onInput: onInput,
      onSelection: onSelection
    };
  }
}

export default formHelper;