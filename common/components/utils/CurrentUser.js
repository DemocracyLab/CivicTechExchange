// @flow
import _ from "lodash";
import type {
  ProjectDetailsAPIData,
  TagDefinition,
  VolunteerUserData,
} from "./ProjectAPIUtils";
import type { GroupDetailsAPIData } from "./GroupAPIUtils.js";

export type MyProjectData = {|
  +project_id: number,
  +project_name: string,
  +project_creator: number,
  +application_id: ?number,
  +user: ?VolunteerUserData,
  +application_text: ?string,
  +roleTag: ?TagDefinition,
  +isApproved: ?boolean,
  +isCreated: ?boolean,
  +isCoOwner: ?boolean,
  +isUpForRenewal: ?boolean,
  +projectedEndDate: ?Date,
|};

export type UserContext = {|
  owned_projects: $ReadOnlyArray<MyProjectData>,
  volunteering_projects: $ReadOnlyArray<MyProjectData>,
|};

class CurrentUser {
  static userID(): ?number {
    return Number(window.DLAB_GLOBAL_CONTEXT.userID) || null;
  }

  static isLoggedIn(): boolean {
    return Boolean(this.userID());
  }

  static isEmailVerified(): boolean {
    return Boolean(window.DLAB_GLOBAL_CONTEXT.emailVerified);
  }

  static firstName(): string {
    return window.DLAB_GLOBAL_CONTEXT.firstName;
  }

  static lastName(): string {
    return window.DLAB_GLOBAL_CONTEXT.lastName;
  }

  static email(): string {
    return window.DLAB_GLOBAL_CONTEXT.email;
  }

  static userImgUrl(): string {
    return _.unescape(window.DLAB_GLOBAL_CONTEXT.userImgUrl);
  }

  static isStaff(): boolean {
    return window.DLAB_GLOBAL_CONTEXT.isStaff;
  }

  static isGroupOwner(group: GroupDetailsAPIData): boolean {
    return this.userID() === group.group_creator;
  }

  static isOwner(project: ProjectDetailsAPIData): boolean {
    return this.userID() === project.project_creator;
  }

  static isCoOwner(project: ProjectDetailsAPIData): boolean {
    // NOTE: Co-Owners are distinct from the project creator for authorization purposes.
    if (CurrentUser.isOwner(project)) return false;
    const thisVolunteer = CurrentUser._getVolunteerStatus(project);
    return thisVolunteer && thisVolunteer.isCoOwner;
  }

  static isOwnerOrVolunteering(project: ProjectDetailsAPIData): boolean {
    return (
      CurrentUser.isOwner(project) || CurrentUser._getVolunteerStatus(project)
    );
  }

  static isCoOwnerOrOwner(project: ProjectDetailsAPIData): boolean {
    return CurrentUser.isOwner(project) || CurrentUser.isCoOwner(project);
  }

  static canVolunteerForProject(project: ProjectDetailsAPIData): boolean {
    return (
      project.project_claimed &&
      CurrentUser.isLoggedIn() &&
      CurrentUser.isEmailVerified() &&
      !CurrentUser._getVolunteerStatus(project) &&
      !CurrentUser.isOwner(project)
    );
  }

  static _getVolunteerStatus(
    project: ProjectDetailsAPIData
  ): ?VolunteerDetailsAPIData {
    return (
      project.project_volunteers &&
      project.project_volunteers.find(
        volunteer => volunteer.user.id === CurrentUser.userID()
      )
    );
  }

  static isVolunteeringUpForRenewal(): boolean {
    return window.DLAB_GLOBAL_CONTEXT.volunteeringUpForRenewal;
  }

  static userContext(): UserContext {
    return window.DLAB_GLOBAL_CONTEXT.userContext;
  }

  static hasProjects(): boolean {
    const userContext: UserContext = CurrentUser.userContext();
    return (
      userContext &&
      (!_.isEmpty(userContext.owned_projects) ||
        !_.isEmpty(userContext.volunteering_projects))
    );
  }
}

export default CurrentUser;
