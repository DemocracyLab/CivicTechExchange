// @flow

import React from 'react';
import SignUpController from '../../controllers/SignUpController.jsx'

type Props = {|
  +json_encoded_errors: string,
|};

class SignUpErrorAdapter extends React.Component<Props> {

  render(): React$Node {
    return <SignUpController errors={this._getErrors()}/>;
  }

  // e.g. {password: ['Password too short.', 'Password too similar.'], ...}
  _getErrors(): {+[key: string]: $ReadOnlyArray<string>} {
    const structuredErrors = {};
    if (this.props.json_encoded_errors) {
      const decodedErrors = JSON.parse(this.props.json_encoded_errors);
      Object.keys(decodedErrors).forEach(field => {
        structuredErrors[field] = decodedErrors[field].map(e => e.message);
      });
    }
    return structuredErrors;
  }
}

export default SignUpErrorAdapter;
