// @flow

import type { TagDefinition } from "./ProjectAPIUtils.js";
import type { Dictionary, PartitionSet } from "../types/Generics.jsx";
import _ from "lodash";

export type TagsByCategory = Dictionary<
  $ReadOnlyArray<TagDefinition> | Dictionary<$ReadOnlyArray<TagDefinition>>
>;

class tagHelpers {
  // Get sorted tags grouped by category
  // TODO: Unit test
  static getSortedTagsByCategory(
    tags: $ReadOnlyArray<TagDefinition>
  ): TagsByCategory {
    const sortedTags: $ReadOnlyArray<TagDefinition> = _.sortBy(tags, [
      "display_name",
    ]);
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
