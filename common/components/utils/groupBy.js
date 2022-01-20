// @flow
import _ from "lodash";

class GroupBy {
  /**
   * Transform a list of objects into new objects, grouped by properties of the old object
   *
   * @param arr           Objects to group and transform
   * @param groupByFunc   Function that selects the property to group by
   * @param transformFunc Function that transforms objects
   */
  static andTransform<Old, New>(
    arr: $ReadOnlyArray<Old>,
    groupByFunc: Old => string,
    transformFunc: Old => New
  ): { [key: string]: New } {
    const groups: { [key: string]: Old } = _.groupBy(arr, groupByFunc);
    const transformedGroups: { [key: string]: New } = {};
    for (let key in groups) {
      transformedGroups[key] = groups[key].map(transformFunc);
    }
    return transformedGroups;
  }
}

export default GroupBy;
