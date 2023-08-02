// @flow
import { TagDefinition } from "./ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import Async from "./async.js";
import { SectionType } from "../enums/Section.js";
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

const tagCategoryEventMapping: { [key: string]: string } = _.fromPairs([
  [TagCategory.ISSUES, "addIssueAreaTag"],
  [TagCategory.TECHNOLOGIES_USED, "addTechUsedTag"],
  [TagCategory.ROLE, "addOpenRoleTag"],
  [TagCategory.ORGANIZATION, "addCommunityTag"],
  [TagCategory.PROJECT_STAGE, "addProjectStageTag"],
]);

type MetricsParameters = Dictionary<string | number>;

type HeapInterface = {|
  track: (eventName: string, properties: ?MetricsParameters) => void,
|};

function _logEvent(eventName: string, parameters: ?MetricsParameters): void {
  if (window.HEAP_ANALYTICS_ID) {
    Async.onEvent("heapLoaded", () => {
      window.heap.track(eventName, parameters);
    });
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

  static logUserAlertCreate(
    filters: string,
    postalCode: string,
    country: string
  ): void {
    _logEvent("userAlertCreate", {
      filters: filters,
      postalCode: postalCode,
      country: country,
    });
  }

  static logUserProfileEditEntry(userId: number): void {
    _logEvent("userProfileEditEntry", { userId: userId });
  }

  static logUserProfileEditSave(userId: number): void {
    _logEvent("userProfileEditSave", { userId: userId });
  }

  static logNavigateToProjectProfile(projectId: string): void {
    _logEvent("navigateToProjectProfile", { projectId: projectId });
  }

  static logNavigateToEventProjectProfile(eventProjectId: string): void {
    _logEvent("navigateToEventProjectProfile", {
      eventProjectId: eventProjectId,
    });
  }

  static logSearchFilterByTagEvent(tag: TagDefinition): void {
    _logEvent(tagCategoryEventMapping[tag.category], { tagName: tag.tag_name });
  }

  static logSearchByKeywordEvent(keyword: string): void {
    _logEvent("searchByKeyword", { keyword: keyword });
  }

  static logGroupSearchByKeywordEvent(keyword: string): void {
    _logEvent("searchGroupByKeyword", { keyword: keyword });
  }

  static logSearchByLocationEvent(location: string): void {
    _logEvent("filter_by_location", { location: location });
  }

  static logSearchChangeSortEvent(sortField: string, entityType: string): void {
    _logEvent("sort_by_field", {
      sortField: sortField,
      entityType: entityType,
    });
  }

  static logFilterProjectsByFavorite(favoritesOnly: boolean): void {
    _logEvent("project_filter_by_favorites", { favoritesOnly: favoritesOnly });
  }

  static logGroupSearchChangeSortEvent(sortField: string): void {
    _logEvent("group_sort_by_field", { sortField: sortField });
  }

  static logProjectClickCreate(userId: number): void {
    _logEvent("projectClickCreate", { userId: userId });
  }

  static logProjectCreated(userId: number): void {
    _logEvent("projectCreated", { userId: userId });
  }

  static logProjectClickEdit(userId: number, projectId: number): void {
    _logEvent("projectClickEdit", { userId: userId, projectId: projectId });
  }

  static logProjectEdited(userId: number, projectId: number): void {
    _logEvent("projectEdited", { userId: userId, projectId: projectId });
  }

  static logProjectDeleted(userId: number, projectId: number): void {
    _logEvent("projectDeleted", { userId: userId, projectId: projectId });
  }

  static logUserClickContactProjectOwner(
    userId: number,
    projectId: number
  ): void {
    _logEvent("UserClickContactProjectOwner", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logUserContactedProjectOwner(userId: number, projectId: number): void {
    _logEvent("UserContactedProjectOwner", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logUserClickContactGroupOwner(userId: number, groupId: number): void {
    _logEvent("UserClickContactGroupOwner", {
      userId: userId,
      groupId: groupId,
    });
  }

  static logUserContactedGroupOwner(userId: number, groupId: number): void {
    _logEvent("UserContactedGroupOwner", { userId: userId, groupId: groupId });
  }

  static logGroupInviteProjectClick(groupId: number, projectId: number): void {
    _logEvent("GroupInviteProjectClick", {
      groupId: groupId,
      projectId: projectId,
    });
  }

  static logGroupInviteProjectSubmit(groupId: number, projectId: number): void {
    _logEvent("GroupInviteProjectSubmit", {
      groupId: groupId,
      projectId: projectId,
    });
  }

  static logGroupInviteProjectSubmitConfirm(
    groupId: number,
    projectId: number
  ): void {
    _logEvent("GroupInviteProjectSubmitConfirm", {
      groupId: groupId,
      projectId: projectId,
    });
  }

  static logVolunteerClickVolunteerButton(
    userId: number,
    projectId: number
  ): void {
    _logEvent("VolunteerClickVolunteerButton", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logVolunteerClickVolunteerSubmit(
    userId: number,
    projectId: number
  ): void {
    _logEvent("VolunteerClickVolunteerSubmit", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logVolunteerClickVolunteerSubmitConfirm(
    userId: number,
    projectId: number
  ): void {
    _logEvent("VolunteerClickVolunteerSubmitConfirm", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logVolunteerClickLeaveButton(userId: number, projectId: number): void {
    _logEvent("VolunteerClickLeaveButton", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logVolunteerClickLeaveConfirm(
    userId: number,
    projectId: number
  ): void {
    _logEvent("VolunteerClickLeaveConfirm", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logProjectApproveVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectApproveVolunteer", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logProjectRejectVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectRejectVolunteer", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logProjectDismissVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectDismissVolunteer", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logProjectPromoteVolunteer(userId: number, projectId: number): void {
    _logEvent("ProjectPromoteVolunteer", {
      userId: userId,
      projectId: projectId,
    });
  }

  static logVolunteerRenewed(userId: number, projectId: number): void {
    _logEvent("VolunteerRenewed", { userId: userId, projectId: projectId });
  }

  static logVolunteerConcluded(userId: number, projectId: number): void {
    _logEvent("VolunteerConcluded", { userId: userId, projectId: projectId });
  }

  static logVolunteerClickReviewCommitmentsInEmail(userId: number): void {
    _logEvent("VolunteerClickedReviewCommitmentsInEmail", { userId: userId });
  }

  static logSectionNavigation(section: SectionType): void {
    _logEvent("sectionLinkClick", { section: section });
  }

  static logClickHeaderLink(url: string, userId: ?number): void {
    _logEvent("headerLinkClick", { url: url, userId: userId || 0 });
  }

  static logProjectSearchResults(
    projectCount: number,
    queryString: string
  ): void {
    _logEvent("projectSearchResults", {
      projectCount: projectCount,
      queryString: queryString,
    });
  }
}

export default metrics;
