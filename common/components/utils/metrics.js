// @flow
import {TagDefinition} from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import _ from 'lodash'

const tagCategoryEventMapping: { [key: string]: string } = _.fromPairs([
  [TagCategory.ISSUES, "addIssueAreaTag"],
  [TagCategory.TECHNOLOGIES_USED, "addTechUsedTag"],
  [TagCategory.ROLE, "addOpenRoleTag"]
]);

class metrics {
  static addTagFilterEvent(tag: TagDefinition): void {
    window.FB.AppEvents.logEvent(
      tagCategoryEventMapping[tag.category],
      null,
      {tagName: tag.tag_name}
    );
  }
}

export default metrics
