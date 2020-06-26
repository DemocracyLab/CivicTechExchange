// @flow

import React from 'react';
import type {Dictionary} from "../types/Generics.jsx";
import urlHelper from "../utils/url.js";

type ErrorArgs = {|
  errorType: string
|}

type State = {|
  errorArgs: ErrorArgs
|};

const ErrorMessagesByType: Dictionary<(ErrorArgs) => string> = {
  MissingOAuthFieldError: (errorArgs: ErrorArgs) => {
    return "Sign up failed, as your account is missing the following fields: " + decodeURI(errorArgs.missing_fields);
  }
};

function getErrorMessage(errorArgs: ErrorArgs): string {
  if(errorArgs.errorType in ErrorMessagesByType) {
    return ErrorMessagesByType[errorArgs.errorType](errorArgs);
  } else {
    return "Error";
  }
}

class ErrorController extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      errorArgs: urlHelper.getSectionArgs().args
    };
  }

  render(): React$Node {
    return (
      <div> 
        {getErrorMessage(this.state.errorArgs)}
      </div>
    );
  }
}

export default ErrorController;
