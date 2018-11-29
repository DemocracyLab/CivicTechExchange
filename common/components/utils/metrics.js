// @flow
import {TagDefinition} from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import Async from "./async.js";
import _ from 'lodash'

const tagCategoryEventMapping: { [key: string]: string } = _.fromPairs([
  [TagCategory.ISSUES, "addIssueAreaTag"],
  [TagCategory.TECHNOLOGIES_USED, "addTechUsedTag"],
  [TagCategory.ROLE, "addOpenRoleTag"],
  [TagCategory.ORGANIZATION, "addCommunityTag"],
  [TagCategory.PROJECT_STAGE, "addProjectStageTag"]
]);

let facebookMetrics = null;

function _logEvent(eventName: string, parameters: ?{ [key: string]: string }): void {
  if(facebookMetrics) {
    facebookMetrics.logEvent(eventName, null, parameters);
  } else {
    // If Facebook metrics hasn't initialized yet, log the event once it's ready
    Async.doWhenReady(
      () => window.FB && window.FB.AppEvents,
      (appEvents) => {
        facebookMetrics = appEvents;
        facebookMetrics.logEvent(eventName, null, parameters);
      },
      1000
    );
  }
}

class metrics {
  static logSigninAttempt(): void {
    _logEvent("UserSigninAttempt");
  }
  
  static logSignupAttempt(): void {
    _logEvent("UserSignupAttempt");
  }

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
