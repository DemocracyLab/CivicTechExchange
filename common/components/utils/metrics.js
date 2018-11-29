// @flow
import {TagDefinition} from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import _ from 'lodash'

const tagCategoryEventMapping: { [key: string]: string } = _.fromPairs([
  [TagCategory.ISSUES, "addIssueAreaTag"],
  [TagCategory.TECHNOLOGIES_USED, "addTechUsedTag"],
  [TagCategory.ROLE, "addOpenRoleTag"],
  [TagCategory.ORGANIZATION, "addCommunityTag"],
  [TagCategory.PROJECT_STAGE, "addProjectStageTag"]
]);

function _logEvent(eventName: string, parameters: ?{ [key: string]: string }): void {
  window.FB.AppEvents.logEvent(eventName, null, parameters);
}

class metrics {
  static logNavigateToProjectProfile(projectId: string): void {
    _logEvent("navigateToProjectProfile", {projectId: projectId});
  }
  
  static logSearchFilterByTagEvent(tag: TagDefinition): void {
    _logEvent(tagCategoryEventMapping[tag.category], {tagName: tag.tag_name});
  }
  
  static logSearchByKeywordEvent(keyword: string): void {
    _logEvent("searchByKeyword", {keyword: keyword});
  }
  
  static logSearchByLocationEvent(location: string): void {
    _logEvent("filter_by_location", {location: location});
  }
  
  static logSearchChangeSortEvent(sortField: string): void {
    _logEvent("sort_by_field", {sortField: sortField});
  }
  
  static logUserClickContactProjectOwner(userId: number, projectId: number): void {
    _logEvent("UserClickContactProjectOwner", {userId: userId, projectId: projectId});
  }
  
  static logUserContactedProjectOwner(userId: number, projectId: number): void {
    _logEvent("UserContactedProjectOwner", {userId: userId, projectId: projectId});
  }

}

export default metrics
