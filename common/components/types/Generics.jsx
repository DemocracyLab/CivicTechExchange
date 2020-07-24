// @flow
import _ from "lodash";

export type Dictionary<T> = {[key: string]: T}

// TODO: Add unit test
/**
 * Creates dictionary of objects
 *
 * entries: Objects in dictionary
 * entryKeyFunc(optional): Function that generates string key for object.  If omitted, uses lodash's toString method by default
 */
export function createDictionary<T>(entries: $ReadOnlyArray<T>, entryKeyFunc: (T) => string): Dictionary<T> {
  const entryPairs: $ReadOnlyArray<string | T> = entries.map(
    (entry:T) => [entryKeyFunc ? entryKeyFunc(entry) : _.toString(entry), entry]);
  return _.fromPairs(entryPairs);
}