// @flow
import _ from 'lodash';

class Sort {
  /**
   * Sort named objects in the given name order, with unspecified objects tacked on the end
   * @param arr           Objects to sort
   * @param names         Names of objects in the desired order
   * @param nameSelector  Name function for object
   */
  static byNamedEntries<T>(arr: $ReadOnlyArray<T>, names: $ReadOnlyArray<string>, nameSelector: (T) => string ): Array<T> {
    // Index entries by name
    let entriesByName = _.mapKeys(arr, nameSelector);
    let namedEntries = [];
    let remainingEntries = _.clone(arr);
    names.forEach((name) => {
      if(name in entriesByName) {
        namedEntries.push(entriesByName[name]);
        _.pull(remainingEntries, entriesByName[name]);
      }
    });
    // Concatenate remaining entries after named entries
    return namedEntries.concat(remainingEntries);
  }
}

export default Sort;
