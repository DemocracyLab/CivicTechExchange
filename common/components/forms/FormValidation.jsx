// @flow

import React from 'react';
import _ from 'lodash'

export type Validation = {|
  checkFunc: (formState: any) => boolean,
  errorMessage: string
|};

type Props = {|
  validations: $ReadOnlyArray<Validation>,
  onValidationCheck: (boolean) => void,
  formState: any
|};
type State = {|
  errorMessages: Array<string>
|};

/**
 * Performs validations for forms, displaying errors in the markup where the component is placed
 */
class FormValidation extends React.PureComponent<Props,State>  {
  constructor(props: Props): void {
    super(props);
    this.state = {
      errorMessages: []
    };
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.formState && nextProps.validations) {
      var failedValidations = _.filter(nextProps.validations, validation => !validation.checkFunc(nextProps.formState));
      var validationSuccess = _.isEmpty(failedValidations);
      this.setState({
        errorMessages: failedValidations.map(validation => validation.errorMessage)
      });
      nextProps.onValidationCheck && nextProps.onValidationCheck(validationSuccess);
    }
  }
  
  render(): React$Node {
    return (
      <ul>
        {this.state.errorMessages && this.state.errorMessages.map((msg,i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    );
  }
  
}

export default FormValidation;
