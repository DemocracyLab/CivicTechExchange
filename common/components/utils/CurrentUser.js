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

  static isStaff() : boolean {
    return window.DLAB_GLOBAL_CONTEXT.isStaff;
  }

  static isCoOwner(project: ProjectDetailsAPIData): boolean {
    const currentUserId = this.userID();
    // NOTE: Co-Owners are distinct from the project creator for authorization purposes.
    if (!currentUserId || currentUserId === project.project_creator) return false;
    const thisVolunteer = project.project_volunteers.find(volunteer => volunteer.user.id === currentUserId);
    return thisVolunteer && thisVolunteer.isCoOwner;
  }
  
  static canVolunteerForProject(project: ProjectDetailsAPIData): boolean {
    return project.project_claimed
      && CurrentUser.isLoggedIn()
      && CurrentUser.isEmailVerified()
      && !CurrentUser._getVolunteerStatus(project);
  }
  
  static _getVolunteerStatus(project: ProjectDetailsAPIData): ?VolunteerDetailsAPIData {
    return project.project_volunteers && project.project_volunteers.find(volunteer => volunteer.user.id === CurrentUser.userID());
  }
}

export default CurrentUser;
