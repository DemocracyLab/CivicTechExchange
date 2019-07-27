// @flow

import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';

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
    return window.DLAB_GLOBAL_CONTEXT.userImgUrl;
  }

  static isStaff() : boolean {
    return window.DLAB_GLOBAL_CONTEXT.isStaff;
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
    return CurrentUser.isOwner(project) || CurrentUser._getVolunteerStatus(project);
  }

  static isCoOwnerOrOwner(project: ProjectDetailsAPIData): boolean {
    return CurrentUser.isOwner(project) || CurrentUser.isCoOwner(project);
  }
  
  static canVolunteerForProject(project: ProjectDetailsAPIData): boolean {
    return project.project_claimed
      && CurrentUser.isLoggedIn()
      && CurrentUser.isEmailVerified()
      && !CurrentUser._getVolunteerStatus(project)
      && !CurrentUser.isOwner(project);
  }
  
  static _getVolunteerStatus(project: ProjectDetailsAPIData): ?VolunteerDetailsAPIData {
    return project.project_volunteers && project.project_volunteers.find(volunteer => volunteer.user.id === CurrentUser.userID());
  }
  
  static isVolunteeringUpForRenewal() : boolean {
    return window.DLAB_GLOBAL_CONTEXT.volunteeringUpForRenewal;
  }
}

export default CurrentUser;
