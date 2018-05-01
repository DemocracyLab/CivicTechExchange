// @flow

class metrics {
  static logUserContactedProjectOwner(userId: number, projectId: number) {
    var params = {};
    params['userId'] = userId;
    params['projectId'] = projectId;
    FB.AppEvents.logEvent('UserContactedProjectOwner', null, params);
  }
}

export default metrics
