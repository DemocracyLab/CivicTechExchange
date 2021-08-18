// @flow

import type { TagDefinitionCount } from "./ProjectAPIUtils.js";
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

export type TagsByCategory = Dictionary<
  | $ReadOnlyArray<TagDefinitionCount>
  | Dictionary<$ReadOnlyArray<TagDefinitionCount>>
>;

class tagHelpers {
  // Get sorted tags grouped by category
  // TODO: Unit test
  static getSortedTagsByCategory(
    tags: $ReadOnlyArray<TagDefinitionCount>
  ): TagsByCategory {
    const sortedTags: $ReadOnlyArray<TagDefinitionCount> = _.chain(tags)
      .filter((tag: TagDefinitionCount) => tag.num_times > 0)
      .sortBy(["display_name"])
      .value();
    let tagsByCategory: TagsByCategory = _.groupBy(sortedTags, "category");
    _.keys(tagsByCategory).forEach((category: string) => {
      if (tagsByCategory[category][0].subcategory) {
        tagsByCategory[category] = _.groupBy(
          tagsByCategory[category],
          "subcategory"
        );
      }
    });
    return tagsByCategory;
  }
}

export default tagHelpers;
