// @flow
import Promise from "bluebird";

class promiseHelper {
  /**
   * Return a dummy promise that returns the given value immediately
   */
  static return(value: any): Promise<any> {
    return new Promise(function(resolve) {
      resolve(value);
    });
  }
}

export default promiseHelper;
