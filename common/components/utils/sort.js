// @flow
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

class Sort {
  /**
   * Sort named objects in the given name order, with unspecified objects tacked on the end
   * @param arr           Objects to sort
   * @param names         Names of objects in the desired order
   * @param nameSelector  Name function for object
   */
  static byNamedEntries<T>(
    arr: $ReadOnlyArray<T>,
    names: $ReadOnlyArray<string>,
    nameSelector: ?(T) => string
  ): Array<T> {
    // Index entries by name
    let entriesByName = _.mapKeys(arr, nameSelector || (val => val));
    let namedEntries = [];
    let remainingEntries = _.clone(arr);
    names.forEach(name => {
      if (name in entriesByName) {
        namedEntries.push(entriesByName[name]);
        _.pull(remainingEntries, entriesByName[name]);
      }
    });
    // Concatenate remaining entries after named entries
    return namedEntries.concat(remainingEntries);
  }

  /**
   * Take a dictionary of numeric values and return the keys in order of their numeric values
   * @param dict          Dictionary of numeric values
   * @param ascending     Whether to sort ascending (default=descending)
   * @returns {Array}     Sorted array of dictionary keys
   */
  static byCountDictionary(
    dict: Dictionary<number>,
    ascending: ?boolean
  ): $ReadOnlyArray<string> {
    // Handle descending sort by negating count
    const reverseOperator: number = ascending ? 1 : -1;
    return _.sortBy(_.keys(dict), (key: string) => reverseOperator * dict[key]);
  }
}

export default Sort;
