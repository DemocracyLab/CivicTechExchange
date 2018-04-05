// @flow

class CurrentUser {

  static userID(): ?number {
    return Number(window.DLAB_GLOBAL_CONTEXT.userID) || null;
  }

  static isLoggedIn(): bool {
    return Boolean(this.userID());
  }
  
  static isEmailVerified(): bool {
    return Boolean(window.DLAB_GLOBAL_CONTEXT.emailVerified);
  }

  static firstName(): string {
    return window.DLAB_GLOBAL_CONTEXT.firstName;
  }

  static lastName(): string {
    return window.DLAB_GLOBAL_CONTEXT.lastName;
  }
}

export default CurrentUser;
