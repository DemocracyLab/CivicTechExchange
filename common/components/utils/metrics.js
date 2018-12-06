// @flow
import {TagDefinition} from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import Async from "./async.js";
import {SectionType} from "../enums/Section.js";
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
      1000,
      5
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
  
  static logUserAlertButtonClick(): void {
    _logEvent("userAlertButtonClick");
  }
  
  static logUserAlertCreate(filters: string, postalCode: string, country: string): void {
    _logEvent("userAlertCreate", {filters: filters, postalCode: postalCode, country: country});
  }
  
  static logUserProfileEditEntry(userId: number): void {
    _logEvent("userProfileEditEntry", {userId: userId});
  }
  
  static logUserProfileEditSave(userId: number): void {
    _logEvent("userProfileEditSave", {userId: userId});
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
  
  static logProjectClickCreate(userId: number): void {
    _logEvent("projectClickCreate", {userId: userId});
  }
  
  static logProjectCreated(userId: number): void {
    _logEvent("projectCreated", {userId: userId});
  }
  
  static logProjectClickEdit(userId: number, projectId: number): void {
    _logEvent("projectClickEdit", {userId: userId, projectId: projectId});
  }
  
  static logProjectEdited(userId: number, projectId: number): void {
    _logEvent("projectEdited", {userId: userId, projectId: projectId});
  }
  
  static logProjectDeleted(userId: number, projectId: number): void {
    _logEvent("projectDeleted", {userId: userId, projectId: projectId});
  }
  
  static logUserClickContactProjectOwner(userId: number, projectId: number): void {
    _logEvent("UserClickContactProjectOwner", {userId: userId, projectId: projectId});
  }
  
  static logUserContactedProjectOwner(userId: number, projectId: number): void {
    _logEvent("UserContactedProjectOwner", {userId: userId, projectId: projectId});
  }
  
  static logVolunteerClickVolunteerButton(userId: number, projectId: number): void {
    _logEvent("VolunteerClickVolunteerButton", {userId: userId, projectId: projectId});
  }
  
  static logVolunteerClickVolunteerSubmit(userId: number, projectId: number): void {
    _logEvent("VolunteerClickVolunteerSubmit", {userId: userId, projectId: projectId});
  }
  
  static logVolunteerClickVolunteerSubmitConfirm(userId: number, projectId: number): void {
    _logEvent("VolunteerClickVolunteerSubmitConfirm", {userId: userId, projectId: projectId});
  }
  
  static logVolunteerClickLeaveButton(userId: number, projectId: number): void {
    _logEvent("VolunteerClickLeaveButton", {userId: userId, projectId: projectId});
  }
  
  static logVolunteerClickLeaveConfirm(userId: number, projectId: number): void {
    _logEvent("VolunteerClickLeaveConfirm", {userId: userId, projectId: projectId});
  }
  
  static logProjectApproveVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectApproveVolunteer", {userId: userId, projectId: projectId});
  }
  
  static logProjectRejectVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectRejectVolunteer", {userId: userId, projectId: projectId});
  }
  
  static logProjectDismissVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectDismissVolunteer", {userId: userId, projectId: projectId});
  }
  
  static logSectionNavigation(section: SectionType): void {
    _logEvent("sectionLinkClick", {section: section});
  }
}

export default metrics
