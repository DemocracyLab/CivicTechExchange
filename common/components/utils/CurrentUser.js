// @flow
import _ from "lodash";
import type {
  ProjectDetailsAPIData,
  ProjectData,
  TagDefinition,
  VolunteerUserData,
} from "./ProjectAPIUtils.js";
import type { GroupDetailsAPIData } from "./GroupAPIUtils.js";
import type { FileInfo } from "../common/FileInfo.jsx";
import type { EventTileAPIData } from "./EventAPIUtils.js";
import type { Dictionary } from "../types/Generics.jsx";
import type { EventProjectAPIDetails } from "./EventProjectAPIUtils.js";
import { VolunteerDetailsAPIData } from "./ProjectAPIUtils.js";

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
  +slug: string,
|};

// TODO: Rename isApproved to is_searchable
export type MyGroupData = {|
  +group_thumbnail: FileInfo,
  +group_date_modified: Date,
  +group_id: number,
  +group_name: string,
  +group_creator: number,
  +project_relationship_id: Number,
  +relationship_is_approved: boolean,
  +isApproved: ?boolean,
  +isCreated: ?boolean,
  +slug: ?string,
|};

export type MyEventData = {|
  +event_creator: string,
  +is_searchable: ?boolean,
  +is_created: ?boolean,
|} & EventTileAPIData;

export type MyEventProjectData = {|
  event_project_id: string,
  event_id: string,
  event_name: string,
  event_slug: string,
  project_id: number,
  project_name: string,
|};

export type MyRSVPData = {|
  +event_id: number,
  +project_id: ?number,
  +application_id: ?number,
  +user: ?VolunteerUserData,
  +application_text: ?string,
  +roleTag: ?TagDefinition,
  +rsvp_date: ?Date,
|};

export type UserContext = {|
  owned_projects: $ReadOnlyArray<MyProjectData>,
  volunteering_projects: $ReadOnlyArray<MyProjectData>,
  owned_groups: $ReadOnlyArray<MyGroupData>,
  owned_events: $ReadOnlyArray<MyEventData>,
  favorites: Dictionary<ProjectData>,
  rsvp_events: Dictionary<MyRSVPData>,
  event_projects: Dictionary<MyEventProjectData>,
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

  static isOwner(
    project: ProjectDetailsAPIData | EventProjectAPIDetails
  ): boolean {
    return this.userID() === project.project_creator;
  }

  static isCoOwner(
    entity: ProjectDetailsAPIData | EventProjectAPIDetails
  ): boolean {
    // NOTE: Co-Owners are distinct from the project creator for authorization purposes.
    const thisVolunteer = CurrentUser._getVolunteerStatus(entity);
    if (CurrentUser.isOwner(entity)) {
      return false;
    } else if (thisVolunteer) {
      let isCoOwner: boolean = thisVolunteer.isCoOwner;
      if (CurrentUser._isEventProject(entity)) {
        isCoOwner = _.some(
          entity.project_volunteers,
          (volunteer: VolunteerDetailsAPIData) =>
            volunteer.user.id === this.userID() && volunteer.isCoOwner
        );
      }
      return thisVolunteer && isCoOwner;
    }
  }

  static isOwnerOrVolunteering(project: ProjectDetailsAPIData): boolean {
    return (
      CurrentUser.isOwner(project) || CurrentUser._getVolunteerStatus(project)
    );
  }

  static isCoOwnerOrOwner(
    entity: ProjectDetailsAPIData | EventProjectAPIDetails
  ): boolean {
    return CurrentUser.isOwner(entity) || CurrentUser.isCoOwner(entity);
  }

  static _isEventProject(
    entity: ProjectDetailsAPIData | EventProjectAPIDetails
  ) {
    return "event_project_id" in entity;
  }

  static canVolunteerFor(
    entity: ProjectDetailsAPIData | EventProjectAPIDetails
  ): boolean {
    if (CurrentUser._isEventProject(entity)) {
      const eventProject: EventProjectAPIDetails = entity;
      return (
        CurrentUser.isLoggedIn() &&
        CurrentUser.isEmailVerified() &&
        !CurrentUser._getVolunteerStatus(eventProject) &&
        !CurrentUser.isOwner(eventProject)
      );
    } else {
      const project: ProjectDetailsAPIData = entity;
      return (
        project.project_claimed &&
        CurrentUser.isLoggedIn() &&
        CurrentUser.isEmailVerified() &&
        !CurrentUser._getVolunteerStatus(project) &&
        !CurrentUser.isOwner(project)
      );
    }
  }

  static _getVolunteerStatus(
    entity: ProjectDetailsAPIData | EventProjectAPIDetails
  ): ?VolunteerDetailsAPIData {
    if (CurrentUser._isEventProject(entity)) {
      const eventProject: EventProjectAPIDetails = entity;
      return (
        eventProject.event_project_volunteers &&
        eventProject.event_project_volunteers.find(
          volunteer => volunteer.user.id === CurrentUser.userID()
        )
      );
    } else {
      const project: ProjectDetailsAPIData = entity;
      return (
        project.project_volunteers &&
        project.project_volunteers.find(
          volunteer => volunteer.user.id === CurrentUser.userID()
        )
      );
    }
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

  static hasGroups(): boolean {
    const userContext: UserContext = CurrentUser.userContext();
    return userContext && !_.isEmpty(userContext.owned_groups);
  }

  static hasEvents(): boolean {
    const userContext: UserContext = CurrentUser.userContext();
    return (
      CurrentUser.isStaff() ||
      (userContext && !_.isEmpty(userContext.owned_events))
    );
  }
}

export default CurrentUser;
