// @flow

import React from "react";
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

type Props<T> = {|
  sourceObject: ?T,
  fields: Dictionary<(T) => string>,
|};

/**
 * Render a list of hidden form fields based on an object
 */
class HiddenFormFields extends React.Component<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render(): React$Node {
    return (
      <React.Fragment>
        {this.props.fields &&
          _.keys(this.props.fields).map(fieldName => {
            return (
              <input
                type="hidden"
                key={fieldName}
                id={fieldName}
                name={fieldName}
                value={this.props.fields[fieldName](this.props.sourceObject)}
              />
            );
          })}
      </React.Fragment>
    );
  }
}

export default HiddenFormFields;
