// @flow

import React from "react";
import type { Dictionary, KeyValuePair } from "../types/Generics.jsx";
import _ from "lodash";

type DictionaryArgs = {|
  sourceDict: Dictionary<string>,
|};

type SourceFieldsArgs<T> = {|
  sourceObject: ?T,
  fields: Dictionary<(T) => string>,
|};

type Props<T> = DictionaryArgs | SourceFieldsArgs<T>;
/**
 * Render a list of hidden form fields based on an object
 */
class HiddenFormFields extends React.Component<Props> {
  constructor(props: Props): void {
    super(props);
  }
  // TODO: fix for location
  render(): React$Node {
    const nameValues: $ReadOnlyArray<KeyValuePair<string>> = this.props
      .sourceDict
      ? _.entries(this.props.sourceDict)
      : _.keys(this.props.fields).map(fieldName =>
          this.props.fields[fieldName](this.props.sourceObject)
        );

    return (
      <React.Fragment>
        {nameValues.map((kvp: KeyValuePair<string>) =>
          this._renderField(kvp[0], kvp[1])
        )}
      </React.Fragment>
    );
  }

  _renderField(name: string, value: string): React$Node {
    return (
      <input type="hidden" key={name} id={name} name={name} value={value} />
    );
  }
}

export default HiddenFormFields;
