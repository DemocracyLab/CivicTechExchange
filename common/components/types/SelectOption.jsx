// @flow
import _ from "lodash";

export type SelectOption = {|
  label: string,
  value: string
|};

export function mapSelectValueLabel<T>(src: $ReadOnlyArray<T>, mapValue: (T) => string, mapLabel: (T) => string): Array<SelectOption> {
  return _.values(src).map(function (obj: T) {
    return {
      value: mapValue(obj),
      label: mapLabel(obj)
    };
  });
}