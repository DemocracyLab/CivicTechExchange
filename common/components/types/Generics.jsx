// @flow
import _ from "lodash";

// For dictionary of items of a single type
export type Dictionary<T> = { [key: string]: T };
// A key-value pair in array format
export type KeyValuePair<T> = [string, T];
// For the partitioning of arrays into two sets of elements
export type PartitionSet<T> = [$ReadOnlyArray<T>, $ReadOnlyArray<T>];
// For transformation operations that don't change the underlying type, like sorting
export type Transform<T> = T => T;

// TODO: Add unit tests!
/**
 * Creates dictionary of objects
 *
 * entries: Objects in dictionary
 * entryKeyFunc(optional): Function that generates string key for object.  If omitted, uses lodash's toString method by default
 */
export function createDictionary<T, V>(
  entries: $ReadOnlyArray<T>,
  entryKeyFunc: ?(T) => string,
  entryValueFunc: ?(T) => V
): Dictionary<T> {
  const entryPairs: $ReadOnlyArray<string | T> = entries.map((entry: T) => [
    entryKeyFunc ? entryKeyFunc(entry) : _.toString(entry),
    entryValueFunc ? entryValueFunc(entry) : entry,
  ]);
  return _.fromPairs(entryPairs);
}
