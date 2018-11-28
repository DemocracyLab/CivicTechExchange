// @flow
import {TagDefinition} from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import _ from 'lodash'

const tagCategoryEventMapping: { [key: string]: string } = _.fromPairs([
  [TagCategory.ISSUES, "addIssueAreaTag"],
  [TagCategory.TECHNOLOGIES_USED, "addTechUsedTag"],
  [TagCategory.ROLE, "addOpenRoleTag"]
]);

function _logEvent(eventName: string, parameters: ?{ [key: string]: string }): void {
  window.FB.AppEvents.logEvent(eventName, null, parameters);
}

class metrics {
  static addTagFilterEvent(tag: TagDefinition): void {
    _logEvent(tagCategoryEventMapping[tag.category], {tagName: tag.tag_name});
  }
  
  static logUserContactedProjectOwner(userId: number, projectId: number): void {
    var params = {};
    params['userId'] = userId;
    params['projectId'] = projectId;
    window.FB.AppEvents.logEvent('UserContactedProjectOwner', null, params);
  }

}

export default metrics
